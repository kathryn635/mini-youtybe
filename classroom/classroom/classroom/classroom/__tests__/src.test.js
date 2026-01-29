import { JSDOM } from 'jsdom';
import test from 'node:test';
import assert from 'node:assert/strict';

// Set up a DOM environment for render tests
const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.CustomEvent = dom.window.CustomEvent;

// Import modules after DOM is available (use top-level await)
const commentsMod = await import('../src/comments.js');
const renderMod = await import('../src/render.js');
const { createComment, createReply, likeComment, deleteComment } = commentsMod;
const { renderComment, renderReply } = renderMod;

test('step 1', () => {
	// createComment
	const c = createComment('hello world');
	assert.equal(typeof c.id, 'number');
	assert.equal(c.text, 'hello world');
	assert.equal(c.likes, 0);
	assert.deepEqual(c.replies, []);

	// createReply
	const r = createReply(c.id, 'a reply');
	assert.equal(typeof r.id, 'number');
	assert.equal(r.parentId, c.id);
	assert.equal(r.text, 'a reply');
	assert.equal(r.likes, 0);
});

test('step 2', () => {
	// likeComment for top-level comment
	const original = { id: 1, text: 't', likes: 0 };
	const liked = likeComment(original);
	assert.equal(liked.likes, 1);
	assert.equal(original.likes, 0, 'original object must not be mutated');
	assert.notStrictEqual(liked, original);

	// likeComment for reply object shape
	const reply = { id: 2, parentId: 1, text: 'r', likes: 2 };
	const likedR = likeComment(reply);
	assert.equal(likedR.likes, 3);
	assert.equal(reply.likes, 2, 'reply original must not be mutated');
});

test('step 3', () => {
	// setup: two comments, one has a reply
	const reply = { id: 2, parentId: 1, text: 'r', likes: 0 };
	const comment1 = { id: 1, text: 'c1', likes: 0, replies: [reply] };
	const comment2 = { id: 3, text: 'c2', likes: 0, replies: [] };
	const comments = [comment1, comment2];

	// delete top-level comment 3
	const res1 = deleteComment(comments, 3);
	assert.equal(res1.length, 1);
	assert.equal(res1[0].id, 1);
	assert.equal(comments.length, 2, 'original array must not be mutated');

	// delete reply by id (2) should remove from comment1.replies immutably
	const res2 = deleteComment(comments, 2);
	assert.equal(res2.length, 2);
	const c1After = res2.find((x) => x.id === 1);
	assert.equal(c1After.replies.length, 0, 'reply should be removed from replies array');
	const originalC1 = comments.find((x) => x.id === 1);
	assert.equal(originalC1.replies.length, 1, 'original replies must not be mutated');
});

test('step 4', () => {
	const comment = { id: 10, text: 'Hello', likes: 5, replies: [] };
	const el = renderComment(comment);

	assert.ok(el.classList.contains('comment'));
	assert.equal(el.dataset.id, String(comment.id));
	assert.equal(el.querySelector('p').textContent, 'Hello');
	assert.ok(el.querySelector('.like'));
	assert.ok(el.querySelector('.reply-btn'));
	assert.ok(el.querySelector('.delete-btn'));
	assert.ok(el.querySelector('.replies'));

	// custom event dispatched on like and like-count reflects initial likes
	let detail = null;
	el.addEventListener('like', (e) => { detail = e.detail; });
	const likeBtn = el.querySelector('.like');
	const likeCount = likeBtn.querySelector('.like-count');
	assert.equal(likeCount.textContent, '5');
	likeBtn.click();
	assert.ok(detail, 'like event must be dispatched');
	assert.equal(detail.id, comment.id);
	assert.equal(detail.isReply, false);
});

test('step 5', async () => {
	// renderReply checks
	const reply = { id: 20, parentId: 10, text: 'rtext', likes: 2 };
	const rel = renderReply(reply);
	assert.ok(rel.classList.contains('reply'));
	assert.equal(rel.querySelector('p').textContent, 'rtext');
	assert.ok(rel.querySelector('.like'));
	assert.ok(rel.querySelector('.delete-btn'));

	// like event for reply should include isReply: true and parentId
	let rdetail = null;
	rel.addEventListener('like', (e) => { rdetail = e.detail; });
	rel.querySelector('.like').click();
	assert.ok(rdetail);
	assert.equal(rdetail.isReply, true);
	assert.equal(rdetail.parentId, reply.parentId);

	// Basic main.js integration: create DOM elements required before import
	const commentsContainer = document.createElement('div');
	commentsContainer.id = 'comments';
	const form = document.createElement('form');
	form.id = 'comment-form';
	const textarea = document.createElement('textarea');
	textarea.id = 'comment-text';
	form.append(textarea);
	document.body.append(commentsContainer, form);

	// import main.js now that DOM exists
	const mainMod = await import('../src/main.js');

	// submit the form to add a comment
	textarea.value = 'from test';
	const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
	form.dispatchEvent(submitEvent);

	// after submit, read live binding from module
	assert.equal(mainMod.comments.length, 1);
	const appended = commentsContainer.querySelector('.comment');
	assert.ok(appended, 'comment should be appended to #comments container');
});


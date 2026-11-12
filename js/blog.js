export function initBlogComments() {
    // Get comments from localStorage
    const savedComments = JSON.parse(localStorage.getItem("blogComments")) || {};
    let comments = savedComments;

    // Identify this browser user for upvoting
    let userId = localStorage.getItem("commentUserId");
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("commentUserId", userId);
    }

    // Save comments to localStorage
    function saveComments() {
        localStorage.setItem("blogComments", JSON.stringify(comments));
    }

    // Find a comment, including nested replies
    function findComment(commentList, id) {
        for (const comment of commentList) {
            if (comment.id === id) {
                return comment;
            }
            const reply = findComment(comment.replies || [], id);
            if (reply) {
                return reply;
            }
        }
        return null;
    }

    // Create a comment or reply element
    function createCommentElement(comment, articleId) {
        const commentElement = document.createElement("div");
        commentElement.className = "comment";

        const name = document.createElement("strong");
        name.textContent = comment.name;

        const text = document.createElement("p");
        text.textContent = comment.text;

        const date = document.createElement("small");
        date.textContent = new Date(comment.date).toLocaleString();

        const upvoteButton = document.createElement("button");
        upvoteButton.type = "button";
        upvoteButton.className = "upvote-button";
        upvoteButton.dataset.commentId = comment.id;

        const hasUpvoted = comment.votes.includes(userId);
        upvoteButton.textContent = `Upvote (${comment.votes.length})`;
        upvoteButton.disabled = hasUpvoted;

        const replyButton = document.createElement("button");
        replyButton.type = "button";
        replyButton.className = "reply-button";
        replyButton.textContent = "Reply";

        const replyForm = document.createElement("form");
        replyForm.className = "comment-form reply-form";
        replyForm.hidden = true;
        replyForm.dataset.parentId = comment.id;
        replyForm.dataset.articleId = articleId;

        const replyNameLabel = document.createElement("label");
        replyNameLabel.textContent = "Name:";

        const replyName = document.createElement("input");
        replyName.type = "text";
        replyName.name = "name";
        replyName.required = true;

        const replyTextLabel = document.createElement("label");
        replyTextLabel.textContent = "Reply:";

        const replyText = document.createElement("textarea");
        replyText.name = "comment";
        replyText.required = true;

        const replySubmit = document.createElement("button");
        replySubmit.type = "submit";
        replySubmit.textContent = "Post Reply";
        replyForm.append(
            replyNameLabel,
            replyName,
            replyTextLabel,
            replyText,
            replySubmit
        );

        const repliesContainer = document.createElement("div");
        repliesContainer.className = "replies";
        comment.replies.forEach(function (reply) {
            repliesContainer.appendChild(
                createCommentElement(reply, articleId)
            );
        });
        commentElement.append(
            name,
            text,
            date,
            upvoteButton,
            replyButton,
            replyForm,
            repliesContainer
        );
        return commentElement;
    }

    // Render comments, newest first
    function renderComments() {
        document.querySelectorAll(".comments-section").forEach(function (section) {
            const articleId = section.dataset.articleId;
            const commentsList = section.querySelector(".comments-list");
            commentsList.replaceChildren();
            const articleComments = comments[articleId] || [];
            articleComments.forEach(function (comment) {
                commentsList.appendChild(
                    createCommentElement(comment, articleId)
                );
            });
        });
    }

    // Add a new comment or reply
    function addComment(articleId, name, text, parentId = null) {
        const newComment = {
            id: crypto.randomUUID(),
            name: name,
            text: text,
            date: new Date().toISOString(),
            votes: [],
            replies: []
        };
        if (!comments[articleId]) {
            comments[articleId] = [];
        }
        if (parentId) {
            const parentComment = findComment(comments[articleId], parentId);
            if (parentComment) {
                parentComment.replies.unshift(newComment);
            }
        } else {
            comments[articleId].unshift(newComment);
        }
        saveComments();
        renderComments();
    }

    // Handle comment and reply forms
    document.addEventListener("submit", function (event) {
        const form = event.target;
        if (!form.matches(".comment-form")) {
            return;
        }
        event.preventDefault();
        const section = form.closest(".comments-section");
        const articleId = form.dataset.articleId || section.dataset.articleId;
        const name = form.elements.name.value.trim();
        const text = form.elements.comment.value.trim();
        const parentId = form.dataset.parentId || null;
        if (!name || !text) {
            return;
        }
        addComment(articleId, name, text, parentId);
        form.reset();
    });

    // Handle reply buttons and upvotes
    document.addEventListener("click", function (event) {
        if (event.target.matches(".reply-button")) {
            const comment = event.target.closest(".comment");
            const replyForm = comment.querySelector(":scope > .reply-form");
            replyForm.hidden = !replyForm.hidden;
        }
        if (event.target.matches(".upvote-button")) {
            const commentId = event.target.dataset.commentId;
            const section = event.target.closest(".comments-section");
            const articleId = section.dataset.articleId;
            const comment = findComment(comments[articleId], commentId);
            if (comment && !comment.votes.includes(userId)) {
                comment.votes.push(userId);
                saveComments();
                renderComments();
            }
        }
    });

    // Initial rendering
    renderComments();
}

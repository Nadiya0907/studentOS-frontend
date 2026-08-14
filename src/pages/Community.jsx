import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Bookmark,
  TrendingUp,
  Code2,
  GraduationCap,
  Briefcase,
  X,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { communityService } from "../services/communityService";
import { useAuth } from "../context/AuthContext";

const categories = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "academic",
    label: "Academic",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "career",
    label: "Career",
  },
];

const mockPosts = [
  {
    id: 1,
    title: "Spring Boot Roadmap",
    author: "Aarav",
    content:
      "Can someone recommend a good roadmap for learning Spring Boot and building a real-world backend project?",
    category: "projects",
    likes_count: 24,
    comments: [],
    created_at: "2 hours ago",
    tags: ["Spring Boot", "Java"],
  },
  {
    id: 2,
    title: "First React Project",
    author: "Priya",
    content:
      "I completed my first React project today! If anyone is preparing for frontend interviews, I would be happy to share the resources I used.",
    category: "career",
    likes_count: 41,
    comments: [],
    created_at: "5 hours ago",
    tags: ["React", "Frontend"],
  },
  {
    id: 3,
    title: "DBMS Preparation",
    author: "Rahul",
    content:
      "What is the best way to prepare DBMS normalization and SQL queries for placement interviews?",
    category: "academic",
    likes_count: 18,
    comments: [],
    created_at: "Yesterday",
    tags: ["DBMS", "SQL"],
  },
];

export default function Community() {
  const { onMenu } = useOutletContext() || {};
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [posting, setPosting] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [likedPosts, setLikedPosts] = useState(
    new Set()
  );

  const [savedPosts, setSavedPosts] = useState(
    new Set()
  );

  const [expandedComments, setExpandedComments] =
    useState(new Set());

  const [commentInputs, setCommentInputs] =
    useState({});

  const [commentLoading, setCommentLoading] =
    useState({});

  const [editingPostId, setEditingPostId] =
    useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] =
    useState("");

  const author =
    user?.name ||
    user?.email?.split("@")[0] ||
    "Student";

  const loadPosts = async () => {
    setLoading(true);

    try {
      const response =
        await communityService.getPosts();

      const responsePosts =
        response?.data?.posts ||
        response?.posts ||
        [];

      if (
        Array.isArray(responsePosts) &&
        responsePosts.length > 0
      ) {
        setPosts(responsePosts);
      } else {
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error(
        "Community load error:",
        error
      );

      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // -----------------------------
  // CREATE POST
  // -----------------------------

  const createPost = async () => {
    if (!title.trim()) {
      toast.error("Add a title for your post.");
      return;
    }

    if (!text.trim()) {
      toast.error(
        "Write something before posting."
      );
      return;
    }

    setPosting(true);

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      content: text.trim(),
      author,
      tags,
    };

    try {
      await communityService.createPost(
        payload
      );

      setTitle("");
      setText("");
      setTagsInput("");

      toast.success("Post published");

      await loadPosts();
    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not publish post."
      );
    } finally {
      setPosting(false);
    }
  };

  // -----------------------------
  // LIKE POST
  // -----------------------------

  const toggleLike = async (post) => {
    const postId =
      post.id || post._id;

    if (!postId) {
      return;
    }

    setLikedPosts((current) => {
      const next = new Set(current);

      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }

      return next;
    });

    try {
      await communityService.likePost(
        postId,
        author
      );
    } catch (error) {
      console.error(
        "Like error:",
        error
      );

      setLikedPosts((current) => {
        const next = new Set(current);

        if (next.has(postId)) {
          next.delete(postId);
        } else {
          next.add(postId);
        }

        return next;
      });

      toast.error(
        "Could not update like."
      );
    }
  };

  // -----------------------------
  // COMMENTS
  // -----------------------------

  const toggleComments = (postId) => {
    setExpandedComments(
      (current) => {
        const next = new Set(current);

        if (next.has(postId)) {
          next.delete(postId);
        } else {
          next.add(postId);
        }

        return next;
      }
    );
  };

  const handleCommentInput = (
    postId,
    value
  ) => {
    setCommentInputs((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  const addComment = async (post) => {
    const postId =
      post.id || post._id;

    const commentText =
      commentInputs[postId]?.trim();

    if (!commentText) {
      toast.error(
        "Write a comment first."
      );
      return;
    }

    setCommentLoading((current) => ({
      ...current,
      [postId]: true,
    }));

    try {
      const response =
        await communityService.addComment(
          postId,
          {
            commenter: author,
            text: commentText,
          }
        );

      const newComment =
        response?.data?.comment ||
        response?.comment ||
        {
          commenter: author,
          text: commentText,
        };

      setPosts((current) =>
        current.map((item) => {
          const itemId =
            item.id || item._id;

          if (itemId !== postId) {
            return item;
          }

          return {
            ...item,
            comments: [
              ...(Array.isArray(
                item.comments
              )
                ? item.comments
                : []),
              newComment,
            ],
          };
        })
      );

      setCommentInputs((current) => ({
        ...current,
        [postId]: "",
      }));

      toast.success(
        "Comment added successfully."
      );
    } catch (error) {
      console.error(
        "Add comment error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not add comment."
      );
    } finally {
      setCommentLoading((current) => ({
        ...current,
        [postId]: false,
      }));
    }
  };

  const deleteComment = async (
    post,
    comment,
    commentIndex
  ) => {
    const postId =
      post.id || post._id;

    const commentId =
      comment.id ||
      comment._id;

    if (!commentId) {
      toast.error(
        "This comment does not have an ID yet."
      );
      return;
    }

    try {
      await communityService.deleteComment(
        commentId
      );

      setPosts((current) =>
        current.map((item) => {
          const itemId =
            item.id || item._id;

          if (itemId !== postId) {
            return item;
          }

          const comments =
            Array.isArray(
              item.comments
            )
              ? item.comments
              : [];

          return {
            ...item,
            comments: comments.filter(
              (_, index) =>
                index !== commentIndex
            ),
          };
        })
      );

      toast.success(
        "Comment deleted."
      );
    } catch (error) {
      console.error(
        "Delete comment error:",
        error
      );

      toast.error(
        "Delete comment endpoint is not available in the current backend yet."
      );
    }
  };

  // -----------------------------
  // EDIT POST
  // -----------------------------

  const startEditPost = (post) => {
    setEditingPostId(
      post.id || post._id
    );

    setEditTitle(
      post.title || ""
    );

    setEditContent(
      post.content || ""
    );
  };

  const cancelEditPost = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEditedPost = async (post) => {
    const postId =
      post.id || post._id;

    if (!editTitle.trim()) {
      toast.error(
        "Post title cannot be empty."
      );
      return;
    }

    if (!editContent.trim()) {
      toast.error(
        "Post content cannot be empty."
      );
      return;
    }

    try {
      await communityService.updatePost(
        postId,
        {
          title: editTitle.trim(),
          content: editContent.trim(),
        }
      );

      setPosts((current) =>
        current.map((item) => {
          const itemId =
            item.id || item._id;

          if (itemId !== postId) {
            return item;
          }

          return {
            ...item,
            title: editTitle.trim(),
            content:
              editContent.trim(),
          };
        })
      );

      toast.success(
        "Post updated successfully."
      );

      cancelEditPost();
    } catch (error) {
      console.error(
        "Update post error:",
        error
      );

      toast.error(
        "Update post endpoint is not available in the current backend yet."
      );
    }
  };

  // -----------------------------
  // DELETE POST
  // -----------------------------

  const deletePost = async (post) => {
    const postId =
      post.id || post._id;

    try {
      await communityService.deletePost(
        postId
      );

      setPosts((current) =>
        current.filter(
          (item) =>
            (item.id || item._id) !==
            postId
        )
      );

      toast.success(
        "Post deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete post error:",
        error
      );

      toast.error(
        "Delete post endpoint is not available in the current backend yet."
      );
    }
  };

  // -----------------------------
  // SAVE POST
  // -----------------------------

  const toggleSave = (id) => {
    setSavedPosts((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
        toast.success(
          "Removed from saved posts"
        );
      } else {
        next.add(id);
        toast.success(
          "Post saved"
        );
      }

      return next;
    });
  };

  // -----------------------------
  // FILTER
  // -----------------------------

  const filteredPosts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return posts.filter((post) => {
      const categoryMatches =
        activeCategory === "all" ||
        post.category ===
          activeCategory ||
        !post.category;

      const searchableText = `
        ${post.title || ""}
        ${post.author || ""}
        ${post.content || ""}
        ${post.category || ""}
        ${
          Array.isArray(post.tags)
            ? post.tags.join(" ")
            : ""
        }
      `.toLowerCase();

      const searchMatches =
        !query ||
        searchableText.includes(
          query
        );

      return (
        categoryMatches &&
        searchMatches
      );
    });
  }, [
    posts,
    search,
    activeCategory,
  ]);

  return (
    <div className="space-y-6">
      {/* Mobile menu */}
      {onMenu && (
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg border border-bg-border bg-bg-hover px-3 py-2 text-sm text-gray-300 md:hidden"
        >
          Menu
        </button>
      )}

      {/* Header */}
      <section className="rounded-2xl border border-bg-border bg-bg-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              StudentOS Community
            </p>

            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Connect, discuss and collaborate.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Ask questions, share resources, find teammates and learn
              from fellow students.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Users size={21} />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Student network
              </p>

              <p className="text-sm font-semibold text-white">
                Learn together 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Feed */}
        <div className="space-y-5 xl:col-span-2">
          {/* Create post */}
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
                <Plus size={19} />
              </div>

              <div>
                <p className="font-semibold text-white">
                  Start a discussion
                </p>

                <p className="text-xs text-gray-500">
                  Share a question, resource, project idea or opportunity.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Post title"
                className="w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
              />

              <textarea
                value={text}
                onChange={(event) =>
                  setText(
                    event.target.value
                  )
                }
                rows={4}
                maxLength={500}
                placeholder="What's on your mind?"
                className="w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/50"
              />

              <input
                value={tagsInput}
                onChange={(event) =>
                  setTagsInput(
                    event.target.value
                  )
                }
                placeholder="Tags separated by commas, e.g. React, Java"
                className="w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-gray-600">
                {text.length}/500
                characters
              </span>

              <Button
                onClick={createPost}
                disabled={
                  posting ||
                  !title.trim() ||
                  !text.trim()
                }
              >
                <Send size={15} />

                {posting
                  ? "Posting..."
                  : "Post"}
              </Button>
            </div>
          </Card>

          {/* Search + categories */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-3 py-2.5">
              <Search
                size={16}
                className="shrink-0 text-gray-500"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search community posts..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="text-gray-500 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(
                (category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category.id
                      )
                    }
                    className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      activeCategory ===
                      category.id
                        ? "bg-accent-gradient text-white"
                        : "border border-bg-border bg-bg-hover text-gray-500 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Feed heading */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">
                Community Feed
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {filteredPosts.length}{" "}
                discussion
                {filteredPosts.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>

            <button
              type="button"
              className="text-xs text-gray-500 hover:text-white"
              onClick={loadPosts}
            >
              Refresh
            </button>
          </div>

          {/* Posts */}
          {loading ? (
            <div className="grid h-60 place-items-center">
              <Spinner />
            </div>
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              title="No discussions found"
              description="Try another search or start the first discussion."
            />
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(
                (post, index) => {
                  const postId =
                    post.id ||
                    post._id ||
                    index;

                  const isLiked =
                    likedPosts.has(
                      postId
                    );

                  const isSaved =
                    savedPosts.has(
                      postId
                    );

                  const postAuthor =
                    post.author ||
                    post.user?.name ||
                    "Student";

                  const isOwner =
                    postAuthor ===
                    author;

                  const comments =
                    Array.isArray(
                      post.comments
                    )
                      ? post.comments
                      : [];

                  const likes =
                    Number(
                      post.likes_count ??
                        post.likes ??
                        0
                    ) +
                    (isLiked ? 1 : 0);

                  const commentsOpen =
                    expandedComments.has(
                      postId
                    );

                  const commentCount =
                    comments.length;

                  return (
                    <Card
                      key={postId}
                      className="transition hover:border-purple-500/20"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-accent-gradient text-sm font-bold text-white">
                            {postAuthor
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-white">
                              {postAuthor}
                            </p>

                            <p className="mt-0.5 text-[11px] text-gray-600">
                              {post.created_at ||
                                post.time ||
                                "Recently"}
                            </p>
                          </div>
                        </div>

                        {isOwner && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                startEditPost(
                                  post
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-bg-hover hover:text-white"
                              title="Edit post"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deletePost(
                                  post
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                              title="Delete post"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Edit mode */}
                      {editingPostId ===
                      postId ? (
                        <div className="mt-4 space-y-3">
                          <input
                            value={
                              editTitle
                            }
                            onChange={(
                              event
                            ) =>
                              setEditTitle(
                                event
                                  .target
                                  .value
                              )
                            }
                            className="w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
                          />

                          <textarea
                            value={
                              editContent
                            }
                            onChange={(
                              event
                            ) =>
                              setEditContent(
                                event
                                  .target
                                  .value
                              )
                            }
                            rows={4}
                            className="w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none focus:border-purple-500/50"
                          />

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={
                                cancelEditPost
                              }
                              className="rounded-xl border border-bg-border bg-bg-hover px-4 py-2 text-xs text-gray-400 hover:text-white"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                saveEditedPost(
                                  post
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2 text-xs font-semibold text-white"
                            >
                              <Check
                                size={14}
                              />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {post.title && (
                            <h3 className="mt-4 text-base font-semibold text-white">
                              {post.title}
                            </h3>
                          )}

                          <p className="mt-3 text-sm leading-6 text-gray-300">
                            {post.content ||
                              post.description ||
                              "Community discussion"}
                          </p>
                        </>
                      )}

                      {/* Tags */}
                      {Array.isArray(
                        post.tags
                      ) &&
                        post.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.map(
                              (tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-bg-border bg-bg-hover px-2.5 py-1 text-[10px] text-gray-400"
                                >
                                  #{tag}
                                </span>
                              )
                            )}
                          </div>
                        )}

                      {/* Actions */}
                      <div className="mt-5 flex items-center justify-between border-t border-bg-border pt-4">
                        <div className="flex items-center gap-5">
                          <button
                            type="button"
                            onClick={() =>
                              toggleLike(
                                post
                              )
                            }
                            className={`flex items-center gap-1.5 text-xs transition ${
                              isLiked
                                ? "text-pink-400"
                                : "text-gray-600 hover:text-pink-400"
                            }`}
                          >
                            <Heart
                              size={15}
                              fill={
                                isLiked
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            {likes}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleComments(
                                postId
                              )
                            }
                            className={`flex items-center gap-1.5 text-xs transition ${
                              commentsOpen
                                ? "text-violet-400"
                                : "text-gray-600 hover:text-violet-400"
                            }`}
                          >
                            <MessageCircle
                              size={15}
                            />
                            {commentCount}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleSave(
                              postId
                            )
                          }
                          className={`transition ${
                            isSaved
                              ? "text-violet-400"
                              : "text-gray-600 hover:text-white"
                          }`}
                        >
                          <Bookmark
                            size={16}
                            fill={
                              isSaved
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </div>

                      {/* Comments */}
                      {commentsOpen && (
                        <div className="mt-4 rounded-xl border border-bg-border bg-bg-hover p-4">
                          <div className="space-y-3">
                            {comments.length ===
                            0 ? (
                              <p className="text-xs text-gray-600">
                                No comments yet.
                                Be the first to
                                comment.
                              </p>
                            ) : (
                              comments.map(
                                (
                                  comment,
                                  commentIndex
                                ) => {
                                  const commenter =
                                    comment.commenter ||
                                    comment.username ||
                                    "Student";

                                  const canDelete =
                                    commenter ===
                                    author;

                                  return (
                                    <div
                                      key={
                                        comment.id ||
                                        comment._id ||
                                        commentIndex
                                      }
                                      className="rounded-xl border border-bg-border bg-bg-card p-3"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <p className="text-xs font-semibold text-white">
                                            {
                                              commenter
                                            }
                                          </p>

                                          <p className="mt-1 text-xs leading-5 text-gray-400">
                                            {comment.text ||
                                              comment.content ||
                                              ""}
                                          </p>
                                        </div>

                                        {canDelete &&
                                          (comment.id ||
                                            comment._id) && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                deleteComment(
                                                  post,
                                                  comment,
                                                  commentIndex
                                                )
                                              }
                                              className="text-gray-600 hover:text-red-400"
                                              title="Delete comment"
                                            >
                                              <Trash2
                                                size={
                                                  14
                                                }
                                              />
                                            </button>
                                          )}
                                      </div>
                                    </div>
                                  );
                                }
                              )
                            )}
                          </div>

                          {/* Add comment */}
                          <div className="mt-4 flex gap-2">
                            <input
                              value={
                                commentInputs[
                                  postId
                                ] || ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleCommentInput(
                                  postId,
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="Write a comment..."
                              className="min-w-0 flex-1 rounded-xl border border-bg-border bg-bg-card px-3 py-2.5 text-xs text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                addComment(
                                  post
                                )
                              }
                              disabled={
                                commentLoading[
                                  postId
                                ]
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-gradient px-3 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Send
                                size={14}
                              />
                              {commentLoading[
                                postId
                              ]
                                ? "..."
                                : "Send"}
                            </button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Team Finder */}
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users size={21} />
              </div>

              <div>
                <p className="font-semibold text-white">
                  Team Finder
                </p>

                <p className="text-xs text-gray-500">
                  Find students for projects
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Looking for teammates? Share your skills,
              project interests and what kind of collaborator
              you need.
            </p>

            <button
              type="button"
              onClick={() => {
                setTitle(
                  "Looking for Project Teammates"
                );
                setText(
                  "Looking for teammates for my project. My skills are "
                );
                setTagsInput(
                  "Team Finder"
                );
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-gradient px-4 py-3 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={15} />
              Create Team Post
            </button>
          </Card>

          {/* Trending */}
          <Card>
            <div className="flex items-center gap-2">
              <TrendingUp
                size={18}
                className="text-orange-400"
              />

              <p className="font-semibold text-white">
                Trending Topics
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  icon: Code2,
                  title: "React & Frontend",
                  count: "128 discussions",
                },
                {
                  icon: GraduationCap,
                  title: "Placement Preparation",
                  count: "96 discussions",
                },
                {
                  icon: Briefcase,
                  title: "Internships",
                  count: "74 discussions",
                },
              ].map((topic) => {
                const Icon =
                  topic.icon;

                return (
                  <button
                    type="button"
                    key={
                      topic.title
                    }
                    className="flex w-full items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-3 text-left transition hover:border-purple-500/20"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-bg-card text-gray-400">
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-200">
                        {topic.title}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-600">
                        {topic.count}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Guidelines */}
          <Card>
            <p className="text-sm font-semibold text-white">
              Community Guidelines
            </p>

            <ul className="mt-4 space-y-3 text-xs leading-5 text-gray-500">
              <li>
                • Be respectful and supportive.
              </li>
              <li>
                • Share useful and relevant information.
              </li>
              <li>
                • Avoid spam and misleading content.
              </li>
              <li>
                • Help fellow students learn and grow.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
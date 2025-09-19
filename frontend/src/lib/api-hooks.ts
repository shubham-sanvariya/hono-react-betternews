import { Post } from "@/shared/types";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetPostsSuccess, upvotePost } from "./api";
import { current, produce } from 'immer'
import { toast } from "sonner";

const updatePostUpvote = (draft: Post) => {
    draft.points += draft.isUpvoted ? -1 : +1;
    draft.isUpvoted = !draft.isUpvoted;
}

export const useUpvotePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: upvotePost,
        onMutate: async (postId) => {
            let prevData;
            await queryClient.cancelQueries({
                queryKey: ["post", Number(postId)]
            });

            queryClient.setQueriesData<InfiniteData<GetPostsSuccess>>({
                queryKey: ["posts"],
                type: "active"
            }, produce((oldData) => {
                prevData = current(oldData);
                if (!oldData) {
                    return undefined;
                }

                oldData.pages.forEach((page) => {
                    page.data.forEach((post) => {
                        if (post.id.toString() === postId) {
                            updatePostUpvote(post);
                        }
                    })
                })
            })
            );

            return { prevData };
        },
        onSuccess: (upvoteData, postId) => {
            queryClient.setQueriesData<InfiniteData<GetPostsSuccess>>({
                queryKey: ["posts"],
            }, produce((oldData) => {
                if (!oldData) {
                    return undefined;
                }
                oldData.pages.forEach(page => page.data.forEach(post => {
                    if (post.id.toString() === postId) {
                        post.points = upvoteData.data.count;
                        post.isUpvoted = upvoteData.data.isUpvoted;
                    }
                }))
            }))
            queryClient.invalidateQueries({
                queryKey: ["posts"],
                type: "inactive",
                refetchType: "none"
            })
        },
        onError: (err, postId, context) => {
            console.error(err);
            toast.error("Failed to upvote post")
            if (context?.prevData) {
                queryClient.setQueriesData({
                    queryKey: ["posts"], type: "active"
                }, context.prevData);

                queryClient.invalidateQueries({
                    queryKey: ["posts"]
                })
            }
        }
    });
}
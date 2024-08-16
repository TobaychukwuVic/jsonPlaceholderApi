import { test, expect, APIResponse } from '@playwright/test';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

test.describe('JSONPlaceholder API Test', () => {
  let totalPosts: number;
  let createdPostId: number;

  test('Read Total Number of Posts and Store in a Variable', async ({ request }) => {
    const response: APIResponse = await request.get('https://jsonplaceholder.typicode.com/posts');
    const posts: Post[] = await response.json();
    totalPosts = posts.length;
    console.log(`Total number of posts: ${totalPosts}`);
    expect(response.status()).toBe(200);
  });

  test('Create a New Post and Store its ID', async ({ request }) => {
    const newPost = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };

    const response: APIResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: newPost,
    });

    const post: Post = await response.json();
    createdPostId = post.id;
    console.log(`Created Post ID: ${createdPostId}`);
    expect(response.status()).toBe(201);
    expect(post.title).toBe(newPost.title);
    expect(post.body).toBe(newPost.body);
    expect(post.userId).toBe(newPost.userId);
  });

 test('Confirm the Update by Getting the Post', async ({ request }) => {
    // Send a GET request to retrieve the post by ID
    const response: APIResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${createdPostId}`);

    // Parse the response body as JSON
    const post: Post = await response.json();
    console.log(`Fetched Post After Update: ${JSON.stringify(post)}`);

    // Verify that the post was updated successfully
    expect(response.status()).toBe(200); // Ensure the post exists
    expect(post.title).toBe('foo updated'); // Ensure the title reflects the update
  });

test('Update the Created Post with PATCH', async ({ request }) => {
    // Define the updated data (e.g., change the title)
    const updatedData = {
      title: 'foo updated',
    };

    // Send a PATCH request to update the post
    const response: APIResponse = await request.patch(`https://jsonplaceholder.typicode.com/posts/${createdPostId}`, {
      data: updatedData,
    });

    // Parse the response body as JSON and verify the update
    const updatedPost: Post = await response.json();
    console.log(`Updated Post: ${JSON.stringify(updatedPost)}`);

    // Check the response status code to ensure the update was successful
    expect(response.status()).toBe(200); // Ensure successful update
    expect(updatedPost.title).toBe(updatedData.title);
  });

  test('Delete the Created Post by ID', async ({ request }) => {
    const response: APIResponse = await request.delete(`https://jsonplaceholder.typicode.com/posts/${createdPostId}`);
    expect(response.status()).toBe(200);

    // Verify deletion
    const verifyResponse: APIResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${createdPostId}`);
    expect(verifyResponse.status()).toBe(404);
  });

  test('Check the Number of Posts to Ensure Integrity', async ({ request }) => {
    const response: APIResponse = await request.get('https://jsonplaceholder.typicode.com/posts');
    const posts: Post[] = await response.json();
    const currentTotalPosts = posts.length;
    console.log(`Current total number of posts: ${currentTotalPosts}`);
    expect(currentTotalPosts).toBe(totalPosts);
  });
});





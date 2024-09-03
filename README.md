# Comment System Integration

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This is a Next.js project that integrates a dynamic comment system with Google Authentication. The comment system allows users to post rich text comments, attach files, tag people, and sort comments by various criteria.

## Design Decisions

- **Next.js:** Chosen for its flexibility, SSR/SSG capabilities, and my familiarity with the framework.
- **Tailwind CSS:** For quick and responsive UI development.
- **Firebase:** Utilized for handling authentication, storage, and database management.
- **Rich Text Editor:** Implemented to allow users to format comments with bold, italic, underline, and hyperlinks.
  .

## Features

- **Google Authentication:** Allows users to sign in with their Google accounts and post comments.
- **Rich Text Comment Input:** Enables users to format their comments with bold, italic, underline, and hyperlink options. Users can also attach image files and tag other users within comments.
- **Comment Sorting:** Users can sort comments by the latest or by popularity based on reactions.
- **Replies:** Supports nested replies up to two levels deep, allowing for threaded discussions.
- **Reaction Buttons:** Users can react to comments, with the reaction counts displayed next to each comment.
- **Pagination:** Displays 8 comments per page with pagination controls.
- **Comment Time Display:** Shows how long ago the comment was posted (e.g., seconds, minutes, hours, days ago).
- **Show More/Less:** For comments longer than 5 lines, users can toggle between showing more or less text.

## Possible Improvements

- **UI Enhancements:** Improve the UI/UX based on user feedback.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- Yarn package manager ( npm install -g yarn )

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Satya90jit/comment-system.git

   ```

2. Navigate to the project directory:

   ```bash
   cd comment-system

   ```

3. Install the dependencies:

   ```bash
   yarn

   ```

4. Run the development server:

   ```bash
   yarn run dev

   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

# Demo

## Deployed URL

Check out the deployed version of this project on Vercel: ...

### UI/UX Responsive

<!-- ![Project Screenshot](./public/home-page-ss.png) -->

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

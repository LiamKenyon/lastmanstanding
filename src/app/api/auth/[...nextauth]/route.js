import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Use environment variable for the secret
  callbacks: {
    async jwt({ token, account, profile }) {
      // If this is the first time the user is signing in, the account and profile objects will be available
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.sub = profile.sub; // Save the 'sub' value from the profile
      }
      return token;
    },
    async session({ session, token }) {
      // Include the tokens in the session
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.user.sub = token.sub; // Include the 'sub' value in the session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

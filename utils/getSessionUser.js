import { getServerSession } from 'next-auth/next';
import { authOptions } from './authOptions';

export const getSessionUser = async () => {
  try {
    //getServerSession is for backend, distinct from useSession hook
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      return null;
    }

    return {
      user: session.user,
      userId: session.user.id
    }
  } catch (err) {
    console.error(err)
    return null
  }
  
};
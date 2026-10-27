export const ADMIN_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
export const FEMALE_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
export const MALE_AVATAR = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

export const getUserAvatar = (user) => {
  if (!user) return MALE_AVATAR;
  if (user.role === 'Admin') {
    return ADMIN_AVATAR;
  }
  
  const gender = user.gender || (user.name && /female|meera|ananya|priya|sneha|pooja|divya|kavya|swati|neha|riya|aarti|shreya/i.test(user.name) ? 'Female' : 'Male');
  
  if (gender === 'Female') {
    return FEMALE_AVATAR;
  }
  
  return MALE_AVATAR;
};

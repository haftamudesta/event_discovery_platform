import { Models } from 'appwrite';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  VIP = 'vip'
}

export type UserInterest = [
   'technology',
   'sports',
   'music',
   'art',
   'travel',
   'food',
   'fitness',
   'gaming',
   'reading',
   'photography',
   'business',
  'education'
]

export interface UserLocation {
  city: string;
  country: string;
  countryCode: string;
  timezone?: string;
}

export interface ProfilePicture {
  url: string;
  thumbnailUrl?: string;
  fileId?: string;
  uploadedAt?: string;
  isDefault: boolean;
}

export interface CustomUser {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
  id: string; 
  name: string;
  email: string;
  password: string; 
  location?: UserLocation;
  profilePicture?: ProfilePicture;
  interests: UserInterest[];
  role: UserRole;
  createdAt: string; 
  updatedAt: string; 
  phoneNumber?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  loginCount: number;
  socialProfiles?: {
    google?: string;
    facebook?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'friends-only';
      showEmail?: boolean;
      showLocation?: boolean;
    };
    language?: string;
  };
  stats?: {
    eventsCount?: number;
    savedEventsCount?: number;
    followersCount?: number;
    followingCount?: number;
  };
}

export type AuthUserType = CustomUser | null;

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  location?: UserLocation;
  profilePicture?: File;
  interests?: UserInterest[];
  role?: UserRole;
  phoneNumber?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: CustomUser['gender'];
}
export interface UpdateUserDto {
  name?: string;
  location?: UserLocation;
  profilePicture?: File | string;
  interests?: UserInterest[];
  role?: UserRole;
  phoneNumber?: string;
  bio?: string;
  website?: string;
  dateOfBirth?: string;
  gender?: CustomUser['gender'];
  preferences?: CustomUser['preferences'];
}

export interface SigninDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export interface SignupDto extends CreateUserDto {
  confirmPassword: string;
  acceptTerms: boolean;
}
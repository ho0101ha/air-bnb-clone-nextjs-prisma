export interface Accommodation {
    id: number;
    name: string;
    description: string;
    price: number;
    location: string;
    locationJP: string;
    imageUrl: string;
    hostId: number | null; // 修正: null 許容
    followersCount: number;
    isFollowing: boolean;
  }

  
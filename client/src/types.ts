export interface User {
  userId: string;
  name: string;
  email: string;
  profileImage: string;
  role: string;
  organisation:string
}

export interface LocationData {
  latitude: number;
  logitude: number;
  formatedAddress: string;
}

export interface AppContextType {
  user: User | null;
  loading: Boolean;
  isAuth: Boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

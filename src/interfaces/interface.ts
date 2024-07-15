import { Socket } from "socket.io";
import { StatusCode } from "./enum";

export interface Message {
    message: string ;
  }

export interface RidePayment {
    paymentMode: string;
    userId: string;
    rideId: string;
    amount: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    driverId:string
  }
  interface RideData {
    name: string;
    value: number;
  }
  
  export interface RideInfo {
    rideData: RideData[];
    totalRides: number;
  }
  
  const exampleData: RideInfo = {
    rideData: [
      { name: 'Wallet', value: 1 },
      { name: 'Upi', value: 4 },
      { name: 'Cash in hand', value: 1 }
    ],
    totalRides: 7
  };
  

  export interface ChatMessage {
    message: string;
    avatar: string;
  }
   interface UserStat {
    userCount: number;
    month: number;
  }
  
  export interface DashboardData {
    stats: UserStat[];
    totalUsers: number;
    blockedUsers: number;
  }

  export interface feedback{
    _id:string,
    rating:string,
    feedback:string,
    driver_id:string,
}
  export interface feedback{
    _id:string,
    rating:string,
    reason:string,
    driver_id:string,
}


interface Ride {
  _id: string;
  ride_id: string;
  driver_id: string;
  user_id: string;
  pickupCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  pickupLocation: string;
  dropoffLocation: string;
  driverCoordinates: Coordinates;
  distance: string;
  duration: string;
  vehicleModel: string;
  price: number;
  date: string;
  status: string;
  pin: number;
  __v: number;
  paymentMode: string;
  feedback: string;
  rating: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PieChartData {
  name: string;
  value: number;
}

interface CountData {
  _id: null;
  totalCount: number;
}

interface TotalAmountData {
  totalAmount: number;
  month: number;
}

export interface rideData {
  count: CountData[];
  pieChartData: Ride[];
  data: TotalAmountData[];
}

export interface AdminLogin {
  message: string;
  email: string;
  token: string;
}


export interface UserInterface extends Document {
  name: string;
  email: string;
  mobile: number;
  password: string;
  userImage: string;
  referral_code: string;
  account_status: string;
  joiningDate: string;
  wallet: {
      balance: number;
      transactions: {
          date: Date;
          details: string;
          amount: number;
          status: string;
      }[];
  };
  RideDetails: {
      completedRides: number;
      cancelledRides: number;
  };
}

export interface UserCredentials {
  userId: string;
  role: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  name: string;
  refreshToken: string;
  token: string;
  _id: string;
}

export interface RideInterface extends Document {
  ride_id: string;
  driver_id: string;
  user_id: string;
  pickupCoordinates: PickupCoordinates;
  dropoffCoordinates: DropoffCoordinates;
  pickupLocation: string;
  dropoffLocation: string;
  driverCoordinates?: {
      latitude?: number;
      longitude?: number;
  };
  distance: string;
  duration: string;
  vehicleModel: string;  // Renamed from 'model' to 'vehicleModel'
  price: number;
  date: string;
  status: string;
  pin: number;
  paymentMode: string;
  feedback?: string;
  rating?: number;
}

interface PickupCoordinates {
  latitude: number;
  longitude: number;
}

interface DropoffCoordinates {
  latitude: number;
  longitude: number;
}

export interface Driver {
  _id: string;
}

interface DecodedToken {
clientId: string;
}

export interface AuthenticatedSocket extends Socket {
decoded?: DecodedToken;
}

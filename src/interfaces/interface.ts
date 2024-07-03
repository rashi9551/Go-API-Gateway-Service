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

  export interface ChatMessage {
    message: string;
    avatar: string;
  }
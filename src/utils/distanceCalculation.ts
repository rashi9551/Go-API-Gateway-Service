export const calculateDistance=(driverLatitude:number,driverLongitude:number,userLatitude:number,userLongitude:number)=>{
    const deg2rad = (deg: any) => deg * (Math.PI / 180);
    driverLatitude = deg2rad(driverLatitude);
    driverLongitude = deg2rad(driverLongitude);
    userLatitude = deg2rad(userLatitude);
    userLongitude = deg2rad(userLongitude);

    const radius = 6371;

    const dlat = userLatitude - driverLatitude;
    const dlon = userLongitude - driverLongitude;

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(driverLatitude) * Math.cos(driverLongitude) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = radius * c;

    return distance;
}

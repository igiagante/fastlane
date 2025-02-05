const PaypalButtonsSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* PayPal button skeleton */}
      <div className="h-12 bg-gray-200 rounded-md w-full" />

      {/* Credit card button skeleton */}
      <div className="h-12 bg-gray-200 rounded-md w-full" />

      {/* Pay Later button skeleton */}
      <div className="h-12 bg-gray-200 rounded-md w-full" />
    </div>
  );
};

export default PaypalButtonsSkeleton;

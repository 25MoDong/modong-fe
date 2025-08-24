import LoadingAnimation from './LoadingAnimation';

const FallbackLoading = ({ message = '로딩 중...' }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-6 rounded-lg shadow-md">
        <LoadingAnimation size="w-14 h-14" />
        <div className="text-sm text-gray-700 font-medium">{message}</div>
      </div>
    </div>
  );
};

export default FallbackLoading;


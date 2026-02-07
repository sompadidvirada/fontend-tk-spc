// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* The Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        
        {/* Optional Text */}
        <p className="text-lg font-medium text-gray-600 animate-pulse font-lao">
          ກຳລັງໂຫຼດຂໍ້ມູນ...
        </p>
      </div>
    </div>
  );
}
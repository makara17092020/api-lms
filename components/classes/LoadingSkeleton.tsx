export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-gray-200 h-64 flex flex-col justify-between animate-pulse"
        >
          <div>
            <div className="h-12 w-12 bg-gray-100 rounded-xl" />
            <div className="h-6 w-3/4 bg-gray-100 rounded-lg mt-4" />
            <div className="h-4 w-1/2 bg-gray-100 rounded-md mt-2" />
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <div className="h-4 w-1/3 bg-gray-100 rounded-md" />
            <div className="h-8 w-24 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

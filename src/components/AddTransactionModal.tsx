interface Props {
  onClose: () => void;
}

export default function AddTransactionModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md">
        <h2 className="text-xl font-bold mb-4">Add expense</h2>
        <p className="text-gray-400 text-sm">Coming soon</p>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
}

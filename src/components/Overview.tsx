interface Props {
  onAddTransaction: () => void;
}

export default function Overview({ onAddTransaction }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onAddTransaction}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl text-base active:bg-blue-700"
      >
        + Add expense
      </button>
    </div>
  );
}

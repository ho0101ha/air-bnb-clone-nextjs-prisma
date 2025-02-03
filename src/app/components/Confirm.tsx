interface ConfirmationModalProps {
    accommodationName: string;
    name: string;
    people: number;
    email: string;
    startDate: string;
    endDate: string;
    handleCancel: () => void;
    handleReservation: () => void;
  }
  
  export default function Confirm({
    accommodationName,
    name,
    people,
    email,
    startDate,
    endDate,
    handleCancel,
    handleReservation,
  }: ConfirmationModalProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">予約内容の確認</h2>
          <p><strong>宿泊施設:</strong> {accommodationName}</p>
          <p><strong>氏名:</strong> {name}</p>
          <p><strong>人数:</strong> {people}</p>
          <p><strong>メールアドレス:</strong> {email}</p>
          <p><strong>チェックイン:</strong> {startDate}</p>
          <p><strong>チェックアウト:</strong> {endDate}</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              修正する
            </button>
            <button
              onClick={handleReservation
              }
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              予約を確定する
            </button>
          </div>
        </div>
      </div>
    );
  }
  
'use client';

import { useState } from 'react';

export default function Plan() {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [resultText, setResultText] = useState('API 요청 결과가 여기에 표시됩니다.');
  const [warningMessage, setWarningMessage] = useState('');

  const handleConfirm = async () => {
    setWarningMessage('');

    if (!destination || !checkInDate || !checkOutDate) {
      setResultText('모든 필드를 채워주세요.');
      return;
    }

    const depDate = new Date(checkInDate);
    const arrDate = new Date(checkOutDate);

    if (arrDate < depDate) {
      setWarningMessage('체크아웃 날짜는 체크인 날짜보다 빠를 수 없습니다.');
      return;
    }

    const params = new URLSearchParams({
      place: destination,
      start: checkInDate,
      end: checkOutDate,
    });

    try {
      const response = await fetch(`http://localhost:8080/api/v1/cloth?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResultText(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('API 요청 에러:', error);
      setResultText('API 요청에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-100">
      <div className="w-full max-w-5xl mt-10 p-4 bg-white rounded-lg shadow-md flex items-end gap-4">
        <div className="flex flex-col basis-0 grow-[1]">
          <label htmlFor="destination" className="text-base font-semibold text-gray-700 mb-2">여행지</label>
          <input
            type="text"
            id="destination"
            placeholder="어디로 떠나시나요?"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="flex flex-col basis-0 grow-[2]">
          <label htmlFor="checkInDate" className="text-base font-semibold text-gray-700 mb-2">체크인</label>
          <input
            type="date"
            id="checkInDate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col basis-0 grow-[2]">
          <label htmlFor="checkOutDate" className="text-base font-semibold text-gray-700 mb-2">체크아웃</label>
          <input
            type="date"
            id="checkOutDate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
      <div className="w-full max-w-5xl mt-10 p-4 bg-white rounded-lg shadow-md min-h-96 flex items-center justify-center text-gray-500">
        {resultText}
      </div>

      {warningMessage && (
        <div className="fixed inset-0 z-40"> {/* Transparent overlay that blocks clicks */} 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg text-center z-50" onClick={(e) => e.stopPropagation()}> {/* Warning message box, stop propagation to prevent closing when clicking inside */} 
            <p className="text-lg font-semibold text-red-600 mb-4">{warningMessage}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setWarningMessage('')}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { PiPencilSimpleLine } from 'react-icons/pi';
import React from 'react';

export default function WriteButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/board/upload');
  };

  return (
    <button
      name="writeButton"
      title="작성하기"
      aria-label="작성하기"
      onClick={handleClick}
      className="bg-gray-50 ml-3 flex items-center justify-center rounded-full p-3 shadow write-button transition-transform duration-200 hover:scale-110 hover:bg-gray-200"
    >
      <PiPencilSimpleLine className="text-[2rem]" />
    </button>
  );
}

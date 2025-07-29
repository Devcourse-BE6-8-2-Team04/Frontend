"use client"; // 이 페이지는 클라이언트 사이드에서 렌더링 됩니다.
import React, { useState } from "react"; // React와 useState 훅을 가져옵니다.
import Modal from "./Modal"; // Modal 컴포넌트를 가져옵니다.


// 이 페이지는 코멘트 목록을 보여주고, 코멘트를 작성할 수 있는 기능을 제공합니다.
// useState 훅을 사용하여 코멘트 목록과 모달의 표시 여부를 관리합니다.
export default function Page() {

    const [comments, setComments] = useState<string[]>([]); // 코멘트 목록을 관리하기 위해 useState 훅을 사용합니다.
                                                            // 목록을 빈 배열로 초기화합니다.

    const [showModal, setShowModal] = useState(false); // 모달의 표시 여부를 관리하기 위해 useState 훅을 사용합니다.
                                                                    // 초기값은 false로 설정하여 모달이 보이지 않도록 합니다.
    // 코멘트 등록
    // handleCreate 함수는 새로운 코멘트를 추가하고 모달을 닫습니다.
    // 매개변수로 받은 comment를 현재 코멘트 목록의 앞에 추가
    // 코멘트는 문자열 타입으로 정의되어 있습니다.
    const handleCreate = (comment: string) => {

        setComments([comment, ...comments]);    // 새로운 코멘트를 현재 목록의 앞에 추가합니다.
                                                // setComments 함수는 React의 상태 업데이트 함수로, 상태를 업데이트하는 데 사용됩니다.
                                                // [comment, ...comments]는 새로운 코멘트를 기존 코멘트 목록 앞에 추가하는 방법입니다.

        setShowModal(false);     // setShowModal 함수를 사용하여 모달을 닫습니다.
                                        // 이 함수는 모달의 표시 여부를 false로 설정하여 모달을 숨깁니다.
                                        // 모달이 닫히면 사용자는 코멘트 목록을 볼 수 있게 됩니다.
                                        // 사용자가 코멘트를 작성한 후에는 모달을 닫아야 하며, 이를 통해 사용자는 작성한 코멘트를 확인할 수 있습니다.
    };

    return (
        <div className="min-h-screen bg-blue-50 p-8" >
            {/* 페이지의 제목과 코멘트 작성 버튼을 포함하는 헤더를 렌더링합니다.}
                헤더는 flexbox를 사용하여 제목과 버튼을 가로로 정렬합니다.
                제목은 2xl 크기의 글씨로 표시되며, 굵은 글씨체를 사용합니다.
                버튼은 파란색 배경에 검은색 글씨로 표시되며, 둥근 모서리를 가지고 있습니다.*/}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">코멘트 목록</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-500 text-black rounded"
                >
                    코멘트 작성
                </button>
            </div>
            {/* 코멘트 목록을 렌더링합니다.
                코멘트 목록은 ul 태그로 감싸져 있으며, 각 코멘트는 li 태그로 표시됩니다.
                코멘트는 흰색 배경에 그림자와 함께 표시되며, 각 코멘트는 여백과 그림자를 가지고 있습니다.
                코멘트 목록은 공간을 가지며, 각 코멘트는 여백과 그림자를 가지고 있습니다.*/}
            <ul className="space-y-4">
                {comments.map((comment, idx) => (
                    <li key={idx} className="bg-white p-4 rounded shadow text-black">{comment}</li>
                ))}
            </ul>

            {/* 모달 컴포넌트를 렌더링합니다.
                showModal이 true일 때만 모달을 표시합니다.
                모달이 닫힐 때 onClose 함수를 호출하고, 코멘트가 작성되면 onCreate 함수를 호출합니다.
                모달은 코멘트 작성 폼을 포함하고 있으며, 사용자가 코멘트를 작성하고 등록할 수 있도록 합니다.
                모달이 열려 있을 때만 렌더링되도록 조건부 렌더링을 사용합니다.
                모달이 열리면 사용자는 코멘트를 작성할 수 있는 폼을 볼 수 있습니다.*/}
            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}
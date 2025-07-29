import React, { useState } from "react"; // React와 useState 훅을 가져옵니다.

// Modal 컴포넌트는 코멘트를 작성할 수 있는 모달 창을 제공합니다.
// 이 컴포넌트는 코멘트 작성 폼과 등록, 취소 버튼을 포함하고 있습니다.
// onClose와 onCreate 함수를 props로 받아 모달을 닫거나 코멘트를 등록할 수 있습니다.
// Props 타입을 정의하여 컴포넌트가 받는 props의 타입을 명시합니다.
// onClose: 모달을 닫는 함수
// onCreate: 코멘트를 등록하는 함수
type Props = {
    onClose: () => void;
    onCreate: (comment: string) => void;
};

export default function Modal({ onClose, onCreate }: Props) {
    // useState 훅을 사용하여 코멘트 입력 상태를 관리합니다.
    // comment 상태는 문자열 타입으로 정의되어 있고 사용자가 입력한 코멘트를 저장합니다.
    // 초기값은 빈 문자열로 설정합니다.
    // setComment 함수는 코멘트 상태를 업데이트하는 데 사용됩니다.
    const [comment, setComment] = useState("");

    return (

        // 모달 창을 렌더링합니다.
        // fixed 클래스를 사용하여 화면 전체에 모달을 표시하고, 배경은 반투명하게 설정합니다.
        // flex 클래스를 사용하여 모달 내용을 중앙에 정렬합니다.
        // z-50 클래스를 사용하여 모달이 다른 요소들 위에 표시되도록 합니다.
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">

            {/*모달 창의 배경과 내용을 감싸는 div입니다.
               bg-white 클래스를 사용하여 흰색 배경을 설정하고, p-6 클래스를 사용하여 내부 여백을 추가합니다.
               rounded 클래스를 사용하여 모달의 모서리를 둥글게 만들고, shadow-lg 클래스를 사용하여 그림자를 추가합니다.
               w-80 클래스를 사용하여 모달의 너비를 80 단위로 설정합니다.
               모달 내부에는 코멘트 작성 폼이 포함되어 있습니다.*/}
            <div className="bg-white p-6 rounded shadow-lg w-80">

                {/* h2 태그는 모달의 제목을 표시합니다.
                    text-lg 클래스를 사용하여 글씨 크기를 설정하고, font-bold 클래스를 사용하여 글씨를 굵게 만듭니다.
                    mb-4 클래스를 사용하여 제목과 입력 영역 사이에 여백을 추가합니다.
                    text-black 클래스를 사용하여 글씨 색상을 검은색으로 설정합니다.
                */}
                <h2 className="text-lg font-bold mb-4 text-black">코멘트 작성</h2>

                {/*textarea 태그는 코멘트 입력 영역을 나타내며, w-full 클래스를 사용하여 너비를 100%로 설정합니다.
                   h-24 클래스를 사용하여 높이를 24 단위로 설정하고, p-2 클래스를 사용하여 내부 여백을 추가합니다.
                   border 클래스를 사용하여 테두리를 추가하고, rounded 클래스를 사용하여 모서리를 둥글게 만듭니다.
                   text-gray-500 클래스를 사용하여 글씨 색상을 회색으로 설정합니다.
                   value 속성은 comment 상태로 설정되어 있으며, onChange 이벤트를 통해 사용자가 입력한 값을 상태에 저장합니다.
                   placeholder 속성은 입력 영역에 표시될 안내 문구를 설정합니다.*/}
                <textarea
                    className="w-full h-24 p-2 border rounded text-gray-500"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="코멘트를 입력하세요"
                />

                {/* div 태그는 버튼들을 감싸는 컨테이너입니다.
                    flex 클래스를 사용하여 버튼들을 가로로 정렬하고, justify-end 클래스를 사용하여 오른쪽 정렬합니다.
                    mt-6 클래스를 사용하여 위쪽 여백을 추가하고, gap-2 클래스를 사용하여 버튼들 사이에 간격을 만듭니다.*/}
                <div className="flex justify-end mt-6 gap-2">

                    {/* 버튼 태그는 모달을 닫는 취소 버튼입니다.
                        onClick 이벤트를 통해 onClose 함수를 호출하여 모달을 닫습니다.
                        px-3 py-1 클래스를 사용하여 내부 여백을 추가하고, bg-gray-200 클래스를 사용하여 배경색을 회색으로 설정합니다.
                        rounded 클래스를 사용하여 모서리를 둥글게 만들고, text-black 클래스를 사용하여 글씨 색상을 검은색으로 설정합니다.
                        버튼은 취소 버튼으로, 사용자가 코멘트 작성을 취소할 때 사용됩니다.*/}
                    <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded text-black">취소</button>

                    {/* 버튼 태그는 코멘트를 등록하는 등록 버튼입니다.
                        onClick 이벤트를 통해 onCreate 함수를 호출하여 코멘트를 등록합니다.
                        코멘트가 입력되지 않은 경우 버튼은 비활성화됩니다.
                        코멘트가 입력되면 배경색이 파란색으로 변경되고, 검은색 글씨로 표시됩니다.
                        코멘트가 입력되지 않은 경우 배경색은 회색으로 설정되고, 검은색 글씨로 표시됩니다.*/}
                    <button
                        onClick={() => onCreate(comment)}
                        className={`px-3 py-1 rounded ${comment ? "bg-blue-500 text-black" : "bg-gray-300 text-black"}`}
                        disabled={!comment}
                    >
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
}
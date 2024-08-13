document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    let draggedPiece = null;
    let offsetX = 0;
    let offsetY = 0;

    const pieceImages = {
        'r': 'images/bR.png',
        'n': 'images/bN.png',
        'b': 'images/bB.png',
        'q': 'images/bQ.png',
        'k': 'images/bK.png',
        'p': 'images/bP.png',
        'R': 'images/wR.png',
        'N': 'images/wN.png',
        'B': 'images/wB.png',
        'Q': 'images/wQ.png',
        'K': 'images/wK.png',
        'P': 'images/wP.png'
    };

    function createChessBoard() {
        const initialBoard = [
            'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
            'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
            ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
            ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
            'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
            'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
        ];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                if ((row + col) % 2 === 0) {
                    square.classList.add('white');
                } else {
                    square.classList.add('black');
                }
                const piece = initialBoard[row * 8 + col];
                if (piece !== ' ') {
                    const img = document.createElement('img');
                    img.src = pieceImages[piece];
                    img.alt = piece;
                    img.classList.add('piece');
                    img.dataset.position = `${row}-${col}`;
                    img.draggable = false; // Disable default drag behavior
                    img.addEventListener('mousedown', handleMouseDown);
                    square.appendChild(img);
                }
                chessboard.appendChild(square);
            }
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseDown(event) {
        const target = event.target;
        if (target.tagName === 'IMG' && target.classList.contains('piece')) {
            draggedPiece = target;

            // Get the piece's size and position
            const rect = draggedPiece.getBoundingClientRect();
            const pieceWidth = rect.width;
            const pieceHeight = rect.height;

            // Calculate offset from the cursor to the piece's center
            offsetX = event.clientX - (rect.left + pieceWidth / 2);
            offsetY = event.clientY - (rect.top + pieceHeight / 2);

            // Set the piece to follow the cursor directly
            draggedPiece.style.position = 'absolute';
            draggedPiece.style.width = `${pieceWidth}px`;
            draggedPiece.style.height = `${pieceHeight}px`;
            draggedPiece.style.zIndex = 1000;
            draggedPiece.style.pointerEvents = 'none'; // Prevent the piece from interfering with mouse events

            // Set initial piece position
            const boardRect = chessboard.getBoundingClientRect();
            draggedPiece.style.left = `${event.clientX - pieceWidth / 2 - boardRect.left}px`;
            draggedPiece.style.top = `${event.clientY - pieceHeight / 2 - boardRect.top}px`;

            // Prevent default image dragging behavior
            event.preventDefault();
        }
    }

    function handleMouseMove(event) {
        if (draggedPiece) {
            // Get the chessboard and its bounding rectangle
            const boardRect = chessboard.getBoundingClientRect();
            const pieceWidth = draggedPiece.offsetWidth;
            const pieceHeight = draggedPiece.offsetHeight;

            // Calculate the new position, constrained to the board boundaries
            let newLeft = event.clientX - offsetX - boardRect.left;
            let newTop = event.clientY - offsetY - boardRect.top;

            // Constrain the piece within the board boundaries
            newLeft = Math.max(0, Math.min(newLeft, chessboard.clientWidth - pieceWidth));
            newTop = Math.max(0, Math.min(newTop, chessboard.clientHeight - pieceHeight));

            // Update piece position
            draggedPiece.style.left = `${newLeft}px`;
            draggedPiece.style.top = `${newTop}px`;
        }
    }

    function handleMouseUp(event) {
        if (draggedPiece) {
            const squareUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
            if (squareUnderMouse && squareUnderMouse.classList.contains('square')) {
                // Center the piece within the target square
                const rect = squareUnderMouse.getBoundingClientRect();
                const pieceWidth = draggedPiece.offsetWidth;
                const pieceHeight = draggedPiece.offsetHeight;
                draggedPiece.style.left = `${rect.left + (rect.width - pieceWidth) / 2 - boardRect.left}px`;
                draggedPiece.style.top = `${rect.top + (rect.height - pieceHeight) / 2 - boardRect.top}px`;

                // Append the piece to the square
                squareUnderMouse.appendChild(draggedPiece);

                // Reset styles
                draggedPiece.style.position = '';
                draggedPiece.style.zIndex = '';
                draggedPiece.style.pointerEvents = ''; // Restore pointer events
            } else {
                // Reset styles if not dropped on a valid square
                draggedPiece.style.position = '';
                draggedPiece.style.zIndex = '';
                draggedPiece.style.pointerEvents = ''; // Restore pointer events
            }
            draggedPiece = null;
        }
    }

    createChessBoard();
});

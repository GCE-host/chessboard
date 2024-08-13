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

            // Calculate offset from the cursor to the top-left corner of the piece
            const rect = draggedPiece.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;

            // Set the piece to follow the cursor directly
            draggedPiece.style.position = 'absolute';
            draggedPiece.style.zIndex = 1000;
            draggedPiece.style.pointerEvents = 'none'; // Prevent the piece from interfering with mouse events
        }
    }

    function handleMouseMove(event) {
        if (draggedPiece) {
            movePiece(event.clientX, event.clientY);
        }
    }

    function handleMouseUp(event) {
        if (draggedPiece) {
            const squareUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
            if (squareUnderMouse && squareUnderMouse.classList.contains('square')) {
                // Reset the piece style before appending to the square
                draggedPiece.style.position = 'static';
                draggedPiece.style.zIndex = '';
                draggedPiece.style.pointerEvents = ''; // Restore pointer events
                squareUnderMouse.appendChild(draggedPiece);
            } else {
                // Reset styles if not dropped on a valid square
                draggedPiece.style.position = 'static';
                draggedPiece.style.zIndex = '';
                draggedPiece.style.pointerEvents = ''; // Restore pointer events
            }
            draggedPiece = null;
        }
    }

    function movePiece(clientX, clientY) {
        // Update piece position to follow cursor
        draggedPiece.style.left = `${clientX - offsetX}px`;
        draggedPiece.style.top = `${clientY - offsetY}px`;
    }

    createChessBoard();
});

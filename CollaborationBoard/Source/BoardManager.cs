using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CollaborationBoard.Source;

namespace CollaborationBoard
{
    public static class BoardManager
    {
        private static Dictionary<string, Board> boards;
        private static Random random;

        static BoardManager()
        {
            boards = new Dictionary<string, Board>();
            random = new Random();
        }

        public static NewBoardModel AddNewBoard()
        {
            var key = random.String(10);
            var newBoard = new Board();

            boards.Add(key, newBoard);

            return new NewBoardModel(key);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollaborationBoard
{
    public static class BoardManager
    {
        private static List<Board> boards;
        private static Random random;

        static BoardManager()
        {
            boards = new List<Board>();
            random = new Random();
        }

        public static string CreateBoard()
        {
            string id = random.String(8);

            Board board = new Board(id);

            boards.Add(board);

            return id;
        }

        public static void RemoveBoard(string boardId)
        {
            boards.Remove(a => a.Id == boardId);
        }

        public static Board GetBoard(string boardId)
        {
            return boards.Where(a => a.Id == boardId).FirstOrDefault();
        }

        public static bool BoardExists(string boardId)
        {
            return boards.Find(a => a.Id == boardId) != null;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Threading;
using System.Web;

namespace CollaborationBoard
{
    public static class BoardManager
    {
        private static List<Board> boards;
        private static Random random;
        private static Dictionary<string, IDisposable> deletionCancelationObjects;

        static BoardManager()
        {
            boards = new List<Board>();
            random = new Random();
            deletionCancelationObjects = new Dictionary<string, IDisposable>();
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

        public static bool IsBoardScheduledForDeletion(string boardId)
        {
            return deletionCancelationObjects.ContainsKey(boardId);
        }

        public static void DeleteBoard(string boardId)
        {
            boards.Remove(a => a.Id == boardId);
        }

        public static void DeleteBoard(Board board)
        {
            boards.Remove(board);
        }

        public static void ScheduleBoardDeletion(TimeSpan waitTime, Board board)
        {
            ScheduleBoardDeletion(waitTime, board.Id);
        }

        public static void ScheduleBoardDeletion(TimeSpan waitTime, string boardId)
        {
            if (!deletionCancelationObjects.ContainsKey(boardId))
            {
                var cancel = ThreadPoolScheduler.Instance.Schedule(new DateTimeOffset(DateTime.UtcNow.Add(waitTime)), () =>
                    {
                        DeleteBoard(boardId);

                        if (deletionCancelationObjects.ContainsKey(boardId))
                        {
                            deletionCancelationObjects.Remove(boardId);
                        }
                    });

                deletionCancelationObjects.Add(boardId, cancel);
            }
            else
            {
                throw new InvalidOperationException("Board is already scheduled for deletion.");
            }
        }

        public static void CancelBoardDeletion(string boardId)
        {
            if (deletionCancelationObjects.ContainsKey(boardId))
            {
                deletionCancelationObjects[boardId].Dispose();

                deletionCancelationObjects.Remove(boardId);
            }
            else
            {
                throw new InvalidOperationException("Board is not scheduled for deletion.");
            }
        }
    }
}
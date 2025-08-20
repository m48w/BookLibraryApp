using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IAuthorLogic
    {
        Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync();
    }
}

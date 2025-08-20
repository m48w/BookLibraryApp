using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IAuthorRepository
    {
        Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync();
    }
}

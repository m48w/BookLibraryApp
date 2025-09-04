using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IAuthorRepository
    {
        Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync();
        Task<IAuthorModel?> GetByIdAsync(int id);
        Task<IAuthorModel> AddAsync(IAuthorModel author);
        Task<bool> UpdateAsync(IAuthorModel author);
        Task<bool> DeleteAsync(int id);
    }
}

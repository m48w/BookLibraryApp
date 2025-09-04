using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IAuthorLogic
    {
        Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync();
        Task<IAuthorModel?> GetByIdAsync(int id);
        Task<IAuthorModel> AddAsync(IAuthorModel author);
        Task<bool> UpdateAsync(int id, IAuthorModel author);
        Task<bool> DeleteAsync(int id);
    }
}

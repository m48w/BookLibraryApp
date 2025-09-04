using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IPublisherLogic
    {
        Task<IEnumerable<IPublisherModel>> GetAllAsync();
        Task<IPublisherModel?> GetByIdAsync(int id);
        Task<IPublisherModel> AddAsync(IPublisherModel publisher);
        Task<bool> UpdateAsync(int id, IPublisherModel publisher);
        Task<bool> DeleteAsync(int id);
    }
}

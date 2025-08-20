using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IUserRepository
    {
        Task<IEnumerable<IUserModel>> GetAllUsersAsync();
    }
}

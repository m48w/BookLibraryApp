using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IUserLogic
    {
        Task<IEnumerable<IUserModel>> GetAllUsersAsync();
    }
}

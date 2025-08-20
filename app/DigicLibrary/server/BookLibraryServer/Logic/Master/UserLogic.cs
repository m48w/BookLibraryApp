using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;

namespace BookLibraryServer.Logic.Master
{
    public class UserLogic : IUserLogic
    {
        private readonly IUserRepository _userRepository;

        public UserLogic(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<IUserModel>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
        }
    }
}

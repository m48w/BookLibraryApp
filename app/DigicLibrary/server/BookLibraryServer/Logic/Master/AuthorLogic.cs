using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;

namespace BookLibraryServer.Logic.Master
{
    public class AuthorLogic : IAuthorLogic
    {
        private readonly IAuthorRepository _authorRepository;

        public AuthorLogic(IAuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
        }

        public async Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync()
        {
            return await _authorRepository.GetAllAuthorsAsync();
        }
    }
}

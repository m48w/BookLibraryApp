using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public AuthorRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync()
        {
            var query = @"
SELECT
  [author_id] [Id]
  , [name] [Name]
FROM [dbo].[Authors]
";

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var authors = await connection.QueryAsync<AuthorsModel>(query);
                return authors.Cast<IAuthorModel>();
            });
        }
    }
}

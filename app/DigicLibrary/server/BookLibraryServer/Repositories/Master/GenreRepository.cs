using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class GenreRepository : IGenreRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public GenreRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IGenreModel>> GetAllGenresAsync()
        {
            var query = @"
SELECT
  [genre_id] [Id]
  , [name] [Name]
FROM [dbo].[Genres]

";

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var genres = await connection.QueryAsync<GenresModel>(query);
                return genres.Cast<IGenreModel>();
            });
        }
    }
}

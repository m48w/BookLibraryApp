using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public UserRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IUserModel>> GetAllUsersAsync()
        {
            var query = @"
SELECT
  [user_id] [Id]
  , [name] [Name]
  , [email] [Email]
FROM [dbo].[Users]
";

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var users = await connection.QueryAsync<UsersModel>(query);
                return users.Cast<IUserModel>();
            });
        }
    }
}

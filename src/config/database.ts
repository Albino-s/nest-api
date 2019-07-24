
export default {
    mysql: {
        host: process.env.MYSQL_HOST || 'database',
        port: process.env.MYSQL_PORT || 3306,
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'secret',
        database: process.env.MYSQL_DATABASE || 'nest',
    },
    'mysql-test': {
        host: process.env.MYSQL_HOST || 'database',
        port: process.env.MYSQL_PORT || 3306,
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'secret',
        database: process.env.MYSQL_TEST_DATABASE || 'test',
    }
}

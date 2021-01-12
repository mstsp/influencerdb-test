module.exports.config = () => {
  // Code that generates dynamic data
  return {
    service: 'daily-report',
    region: 'us-east-1',
    stage: 'dev',
    tableName: `daily-report-data`
  };
};
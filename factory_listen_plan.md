Curve Factories

Main
POOL_ADDED_E485C164("0xe485c16479ab7092c0b3fc4649843c06be7f072194675261590c84473ab0aea9"),
List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String lpToken = MainFactory.get_lp_token(pool);
String gaugeFactory = GaugeController.NewGauge => gauge.lpToken()

Crypto
POOL_ADDED_73CCA62A("0x73cca62ab1b520c9715bf4e6c71e3e518c754e7148f65102f43289a7df0efea6"),
List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String lpToken = MainFactory.get_lp_token(pool);
String gaugeFactory = GaugeController.NewGauge => gauge.lp_token()

Factory Stable
PLAIN_POOL_DEPLOYED_5B4A28C9("0x5b4a28c940282b5bf183df6a046b8119cf6edeb62859f75e835eb7ba834cce8d"),
META_POOL_DEPLOYED_01F31CD2("0x01f31cd2abdeb4e5e10ba500f2db0f937d9e8c735ab04681925441b4ea37eda5"),
String pool = getAllPools();
String lpToken = pool;

NEW_GAUGE_FD55B319("0xfd55b3191f9c9dd92f4f134dd700e7d76f6a0c836a08687023d6d38f03ebd877"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String addr = DataDecodeUtil.getAddressByData(topicsAndData.get(1));

LIQUIDITY_GAUGE_DEPLOYED_656BB34C("0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String gauge = DataDecodeUtil.getAddressByData(topicsAndData.get(2));

String lpToken = (ader ?? Gauge).lp_token();

Factory CrvUSD
PLAIN_POOL_DEPLOYED_B8F6972D("0xb8f6972d6e56d21c47621efd7f02fe68f07a17c999c42245b3abd300f34d61eb"),
META_POOL_DEPLOYED_01F31CD2("0x01f31cd2abdeb4e5e10ba500f2db0f937d9e8c735ab04681925441b4ea37eda5"),
String pool = getAllPools();
String lpToken = pool;

LIQUIDITY_GAUGE_DEPLOYED_656BB34C("0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String gauge = DataDecodeUtil.getAddressByData(topicsAndData.get(2));

String lpToken = gauge.lp_token();

Factory Crypto
CRYPTO_POOL_DEPLOYED_0394CB40("0x0394cb40d7dbe28dad1d4ee890bdd35bbb0d89e17924a80a542535e83d54ba14"),
String pool = getAllPools();
String lpToken = pool.token();

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String lpToken = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String coinA = DataDecodeUtil.getAddressByData(topicsAndData.get(2));
String coinB = DataDecodeUtil.getAddressByData(topicsAndData.get(3));
String pool = FactoryCryptoFactory.find_pool_for_coins(coinA, coinB, i = 0);
while (FactoryCryptoFactory.getToken(pool) != lpToken) { pool = FactoryCryptoFactory.find_pool_for_coins(coinA, coinB, I++);}

LIQUIDITY_GAUGE_DEPLOYED_1D6247EA("0x1d6247eae69b5feb96b30be78552f35de45f61fdb6d6d7e1b08aae159b6226af"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String token = DataDecodeUtil.getAddressByData(topicsAndData.get(2));
String gauge = DataDecodeUtil.getAddressByData(topicsAndData.get(3));

Factory EYWA
PLAIN_POOL_DEPLOYED_346FE966("0x346fe9663686052f71c017add9b3eb748f7f91d6c4b75b748c256555b165998a"),
META_POOL_DEPLOYED_01F31CD2("0x01f31cd2abdeb4e5e10ba500f2db0f937d9e8c735ab04681925441b4ea37eda5"),
String pool = getAllPools();
String lpToken = pool;

LIQUIDITY_GAUGE_DEPLOYED_656BB34C("0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String gauge = DataDecodeUtil.getAddressByData(topicsAndData.get(2));

Factory TriCrypto
TRICRYPTO_POOL_DEPLOYED_A307F5D0("0xa307f5d0802489baddec443058a63ce115756de9020e2b07d3e2cd2f21269e2a"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String lpToken = pool;

LIQUIDITY_GAUGE_DEPLOYED_656BB34C("0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String gauge = DataDecodeUtil.getAddressByData(topicsAndData.get(2));

Factory Stable NG
PLAIN_POOL_DEPLOYED_D1D60D46("0xd1d60d4611e4091bb2e5f699eeb79136c21ac2305ad609f3de569afc3471eecc"),
META_POOL_DEPLOYED_01F31CD2("0x01f31cd2abdeb4e5e10ba500f2db0f937d9e8c735ab04681925441b4ea37eda5"),
String pool = getAllPools();
String lpToken = pool;

LIQUIDITY_GAUGE_DEPLOYED_656BB34C("0x656bb34c20491970a8c163f3bd62ead82022b379c3924960ec60f6dbfc5aab3b"),

List<String> topicsAndData = DataDecodeUtil.getDataList(eventLog);
String pool = DataDecodeUtil.getAddressByData(topicsAndData.get(1));
String gauge = DataDecodeUtil.getAddressByData(topicsAndData.get(2));

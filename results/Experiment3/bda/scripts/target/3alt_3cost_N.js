var webppl = require("/usr/local/lib/node_modules/webppl/src/main.js");
var args = require("/usr/local/lib/node_modules/webppl/src/args.js");
args.makeGlobal(__filename, process.argv.slice(2));
var webpplJson = require("/Users/brandon/.webppl/node_modules/webppl-json");
var __runner__ = util.trampolineRunners.cli();
function topK(s, x) {
  console.log(x);
};
var main = (function (_globalCurrentAddress) {
    return function (p) {
        return function (runTrampoline) {
            return function (s, k, a) {
                runTrampoline(function () {
                    return p(s, k, a);
                });
            };
        };
    }(function (globalStore, _k0, _address0) {
        var _currentAddress = _address0;
        _addr.save(_globalCurrentAddress, _address0);
        var Bernoulli = dists.makeBernoulli;
        var Beta = dists.makeBeta;
        var Binomial = dists.makeBinomial;
        var Categorical = dists.makeCategorical;
        var categorical = function categorical(globalStore, _k425, _address4, arg0, arg1) {
            var _currentAddress = _address4;
            _addr.save(_globalCurrentAddress, _address4);
            var _k427 = function (globalStore, params) {
                _addr.save(_globalCurrentAddress, _currentAddress);
                return function () {
                    return Categorical(globalStore, function (globalStore, _result426) {
                        _addr.save(_globalCurrentAddress, _currentAddress);
                        return function () {
                            return sample(globalStore, _k425, _address4.concat('_7'), _result426);
                        };
                    }, _address4.concat('_6'), params);
                };
            };
            return function () {
                return util.isObject(arg0) ? _k427(globalStore, arg0) : _k427(globalStore, {
                    ps: arg0,
                    vs: arg1
                });
            };
        };
        var Cauchy = dists.makeCauchy;
        var Delta = dists.makeDelta;
        var DiagCovGaussian = dists.makeDiagCovGaussian;
        var Dirichlet = dists.makeDirichlet;
        var Discrete = dists.makeDiscrete;
        var Exponential = dists.makeExponential;
        var Gamma = dists.makeGamma;
        var Gaussian = dists.makeGaussian;
        var ImproperUniform = dists.makeImproperUniform;
        var IspNormal = dists.makeIspNormal;
        var KDE = dists.makeKDE;
        var Laplace = dists.makeLaplace;
        var LogisticNormal = dists.makeLogisticNormal;
        var LogitNormal = dists.makeLogitNormal;
        var Marginal = dists.makeMarginal;
        var Mixture = dists.makeMixture;
        var Multinomial = dists.makeMultinomial;
        var MultivariateBernoulli = dists.makeMultivariateBernoulli;
        var MultivariateGaussian = dists.makeMultivariateGaussian;
        var Poisson = dists.makePoisson;
        var RandomInteger = dists.makeRandomInteger;
        var SampleBasedMarginal = dists.makeSampleBasedMarginal;
        var TensorGaussian = dists.makeTensorGaussian;
        var TensorLaplace = dists.makeTensorLaplace;
        var Uniform = dists.makeUniform;
        var flip = function flip(globalStore, _k357, _address26, p) {
            var _currentAddress = _address26;
            _addr.save(_globalCurrentAddress, _address26);
            var _k360 = function (globalStore, _result359) {
                _addr.save(_globalCurrentAddress, _currentAddress);
                var params = { p: _result359 };
                return function () {
                    return Bernoulli(globalStore, function (globalStore, _result358) {
                        _addr.save(_globalCurrentAddress, _currentAddress);
                        return function () {
                            return sample(globalStore, _k357, _address26.concat('_51'), _result358);
                        };
                    }, _address26.concat('_50'), params);
                };
            };
            return function () {
                return ad.scalar.pneq(p, undefined) ? _k360(globalStore, p) : _k360(globalStore, 0.5);
            };
        };
        var uniformDrift = function uniformDrift(globalStore, _k339, _address34, params) {
            var _currentAddress = _address34;
            _addr.save(_globalCurrentAddress, _address34);
            return function () {
                return Uniform(globalStore, function (globalStore, _result340) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    return function () {
                        return sample(globalStore, _k339, _address34.concat('_62'), _result340, {
                            driftKernel: function (globalStore, _k341, _address35, prevVal) {
                                var _currentAddress = _address35;
                                _addr.save(_globalCurrentAddress, _address35);
                                var _k342 = function (globalStore, width) {
                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                    var a = ad.scalar.max(params.a, ad.scalar.sub(prevVal, width));
                                    var b = ad.scalar.min(params.b, ad.scalar.add(prevVal, width));
                                    return function () {
                                        return Uniform(globalStore, _k341, _address35.concat('_61'), {
                                            a: a,
                                            b: b
                                        });
                                    };
                                };
                                return function () {
                                    return _.has(params, 'width') ? _k342(globalStore, params.width) : _k342(globalStore, 0.1);
                                };
                            }
                        });
                    };
                }, _address34.concat('_60'), _.omit(params, 'width'));
            };
        };
        var constF = function constF(globalStore, _k308, _address46, f) {
            var _currentAddress = _address46;
            _addr.save(_globalCurrentAddress, _address46);
            return function () {
                return _k308(globalStore, function (globalStore, _k309, _address47) {
                    var _currentAddress = _address47;
                    _addr.save(_globalCurrentAddress, _address47);
                    return function () {
                        return _k309(globalStore, f);
                    };
                });
            };
        };
        var map_helper = function map_helper(globalStore, _k285, _address65, i, j, f) {
            var _currentAddress = _address65;
            _addr.save(_globalCurrentAddress, _address65);
            var n = ad.scalar.add(ad.scalar.sub(j, i), 1);
            return function () {
                return ad.scalar.eq(n, 0) ? _k285(globalStore, []) : ad.scalar.eq(n, 1) ? f(globalStore, function (globalStore, _result286) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    return function () {
                        return _k285(globalStore, [_result286]);
                    };
                }, _address65.concat('_72'), i) : function (globalStore, n1) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    return function () {
                        return map_helper(globalStore, function (globalStore, _result287) {
                            _addr.save(_globalCurrentAddress, _currentAddress);
                            return function () {
                                return map_helper(globalStore, function (globalStore, _result288) {
                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                    return function () {
                                        return _k285(globalStore, _result287.concat(_result288));
                                    };
                                }, _address65.concat('_74'), ad.scalar.add(i, n1), j, f);
                            };
                        }, _address65.concat('_73'), i, ad.scalar.sub(ad.scalar.add(i, n1), 1), f);
                    };
                }(globalStore, ad.scalar.ceil(ad.scalar.div(n, 2)));
            };
        };
        var map = function map(globalStore, _k283, _address66, fn, l) {
            var _currentAddress = _address66;
            _addr.save(_globalCurrentAddress, _address66);
            return function () {
                return map_helper(globalStore, _k283, _address66.concat('_76'), 0, ad.scalar.sub(l.length, 1), function (globalStore, _k284, _address67, i) {
                    var _currentAddress = _address67;
                    _addr.save(_globalCurrentAddress, _address67);
                    return function () {
                        return fn(globalStore, _k284, _address67.concat('_75'), l[i]);
                    };
                });
            };
        };
        var condition = function condition(globalStore, _k182, _address120, bool) {
            var _currentAddress = _address120;
            _addr.save(_globalCurrentAddress, _address120);
            var _k184 = function (globalStore, _result183) {
                _addr.save(_globalCurrentAddress, _currentAddress);
                return function () {
                    return factor(globalStore, _k182, _address120.concat('_150'), _result183);
                };
            };
            return function () {
                return bool ? _k184(globalStore, 0) : _k184(globalStore, ad.scalar.neg(Infinity));
            };
        };
        var error = function error(globalStore, _k181, _address121, msg) {
            var _currentAddress = _address121;
            _addr.save(_globalCurrentAddress, _address121);
            return function () {
                return _k181(globalStore, util.error(msg));
            };
        };
        var SampleGuide = function SampleGuide(globalStore, _k177, _address125, wpplFn, options) {
            var _currentAddress = _address125;
            _addr.save(_globalCurrentAddress, _address125);
            return function () {
                return ForwardSample(globalStore, _k177, _address125.concat('_154'), wpplFn, _.assign({ guide: !0 }, _.omit(options, 'guide')));
            };
        };
        var OptimizeThenSample = function OptimizeThenSample(globalStore, _k175, _address126, wpplFn, options) {
            var _currentAddress = _address126;
            _addr.save(_globalCurrentAddress, _address126);
            return function () {
                return Optimize(globalStore, function (globalStore, _dummy176) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    var opts = _.pick(options, 'samples', 'onlyMAP', 'verbose');
                    return function () {
                        return SampleGuide(globalStore, _k175, _address126.concat('_156'), wpplFn, opts);
                    };
                }, _address126.concat('_155'), wpplFn, _.omit(options, 'samples', 'onlyMAP'));
            };
        };
        var AISforInfer = function AISforInfer(globalStore, _k171, _address127, wpplFn, options) {
            var _currentAddress = _address127;
            _addr.save(_globalCurrentAddress, _address127);
            return function () {
                return constF(globalStore, function (globalStore, _result174) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    return function () {
                        return Infer(globalStore, function (globalStore, dummyMarginal) {
                            _addr.save(_globalCurrentAddress, _currentAddress);
                            return function () {
                                return AIS(globalStore, function (globalStore, _result173) {
                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                    var _dummy172 = _.assign(dummyMarginal, { normalizationConstant: _result173 });
                                    return function () {
                                        return _k171(globalStore, dummyMarginal);
                                    };
                                }, _address127.concat('_159'), wpplFn, options);
                            };
                        }, _address127.concat('_158'), _result174);
                    };
                }, _address127.concat('_157'), !0);
            };
        };
        var DefaultInfer = function DefaultInfer(globalStore, _k161, _address128, wpplFn, options) {
            var _currentAddress = _address128;
            _addr.save(_globalCurrentAddress, _address128);
            var _dummy170 = util.mergeDefaults(options, {}, 'Infer');
            var maxEnumTreeSize = 200000;
            var minSampleRate = 250;
            var samples = 1000;
            return function () {
                return Enumerate(globalStore, function (globalStore, enumResult) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    var _k169 = function (globalStore, _dummy168) {
                        _addr.save(_globalCurrentAddress, _currentAddress);
                        var _dummy167 = console.log('Using "rejection"');
                        return function () {
                            return Rejection(globalStore, function (globalStore, rejResult) {
                                _addr.save(_globalCurrentAddress, _currentAddress);
                                return function () {
                                    return rejResult instanceof Error ? function (globalStore, _dummy166) {
                                        _addr.save(_globalCurrentAddress, _currentAddress);
                                        return function () {
                                            return CheckSampleAfterFactor(globalStore, function (globalStore, hasSampleAfterFactor) {
                                                _addr.save(_globalCurrentAddress, _currentAddress);
                                                var _k164 = function (globalStore, _dummy163) {
                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                    var _dummy162 = console.log('Using "MCMC"');
                                                    return function () {
                                                        return MCMC(globalStore, _k161, _address128.concat('_166'), wpplFn, { samples: samples });
                                                    };
                                                };
                                                return function () {
                                                    return hasSampleAfterFactor ? function (globalStore, _dummy165) {
                                                        _addr.save(_globalCurrentAddress, _currentAddress);
                                                        return function () {
                                                            return SMC(globalStore, function (globalStore, smcResult) {
                                                                _addr.save(_globalCurrentAddress, _currentAddress);
                                                                return function () {
                                                                    return dists.isDist(smcResult) ? _k161(globalStore, smcResult) : smcResult instanceof Error ? _k164(globalStore, console.log(ad.scalar.add(smcResult.message, '..quit SMC'))) : error(globalStore, _k164, _address128.concat('_165'), 'Invalid return value from SMC');
                                                                };
                                                            }, _address128.concat('_164'), wpplFn, {
                                                                throwOnError: !1,
                                                                particles: samples
                                                            });
                                                        };
                                                    }(globalStore, console.log('Using "SMC" (interleaving samples and factors detected)')) : _k164(globalStore, undefined);
                                                };
                                            }, _address128.concat('_163'), wpplFn);
                                        };
                                    }(globalStore, console.log(ad.scalar.add(rejResult.message, '..quit rejection'))) : dists.isDist(rejResult) ? _k161(globalStore, rejResult) : error(globalStore, _k161, _address128.concat('_167'), 'Invalid return value from rejection');
                                };
                            }, _address128.concat('_162'), wpplFn, {
                                minSampleRate: minSampleRate,
                                throwOnError: !1,
                                samples: samples
                            });
                        };
                    };
                    return function () {
                        return dists.isDist(enumResult) ? _k161(globalStore, enumResult) : enumResult instanceof Error ? _k169(globalStore, console.log(ad.scalar.add(enumResult.message, '..quit enumerate'))) : error(globalStore, _k169, _address128.concat('_161'), 'Invalid return value from enumerate');
                    };
                }, _address128.concat('_160'), wpplFn, {
                    maxEnumTreeSize: maxEnumTreeSize,
                    maxRuntimeInMS: 5000,
                    throwOnError: !1,
                    strategy: 'depthFirst'
                });
            };
        };
        var Infer = function Infer(globalStore, _k154, _address129, options, maybeFn) {
            var _currentAddress = _address129;
            _addr.save(_globalCurrentAddress, _address129);
            var _k160 = function (globalStore, wpplFn) {
                _addr.save(_globalCurrentAddress, _currentAddress);
                var _k159 = function (globalStore, _dummy158) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    var methodMap = {
                        SMC: SMC,
                        MCMC: MCMC,
                        PMCMC: PMCMC,
                        asyncPF: AsyncPF,
                        rejection: Rejection,
                        enumerate: Enumerate,
                        incrementalMH: IncrementalMH,
                        forward: ForwardSample,
                        optimize: OptimizeThenSample,
                        AIS: AISforInfer,
                        defaultInfer: DefaultInfer
                    };
                    var _k157 = function (globalStore, methodName) {
                        _addr.save(_globalCurrentAddress, _currentAddress);
                        var _k156 = function (globalStore, _dummy155) {
                            _addr.save(_globalCurrentAddress, _currentAddress);
                            var method = methodMap[methodName];
                            return function () {
                                return method(globalStore, _k154, _address129.concat('_170'), wpplFn, _.omit(options, 'method', 'model'));
                            };
                        };
                        return function () {
                            return _.has(methodMap, methodName) ? _k156(globalStore, undefined) : function (globalStore, methodNames) {
                                _addr.save(_globalCurrentAddress, _currentAddress);
                                var msg = ad.scalar.add(ad.scalar.add(ad.scalar.add(ad.scalar.add('Infer: \'', methodName), '\' is not a valid method. The following methods are available: '), methodNames.join(', ')), '.');
                                return function () {
                                    return error(globalStore, _k156, _address129.concat('_169'), msg);
                                };
                            }(globalStore, _.keys(methodMap));
                        };
                    };
                    return function () {
                        return options.method ? _k157(globalStore, options.method) : _k157(globalStore, 'defaultInfer');
                    };
                };
                return function () {
                    return _.isFunction(wpplFn) ? _k159(globalStore, undefined) : error(globalStore, _k159, _address129.concat('_168'), 'Infer: a model was not specified.');
                };
            };
            return function () {
                return util.isObject(options) ? maybeFn ? _k160(globalStore, maybeFn) : _k160(globalStore, options.model) : _k160(globalStore, options);
            };
        };
        var json = {
            read: webpplJson.read,
            write: webpplJson.write
        };
        var resultsfileName = 'results/3alt_3cost_N/target.json';
        var itemData = [
            {
                id: 'baseball',
                observed_competitor: 0.2273,
                competitor_prior: 0.6,
                target_nameability: 1,
                competitor_nameability: 0.9667
            },
            {
                id: 'cake',
                observed_competitor: 0.2727,
                competitor_prior: 0.5333,
                target_nameability: 1,
                competitor_nameability: 1
            },
            {
                id: 'flower',
                observed_competitor: 0.1818,
                competitor_prior: 0.6,
                target_nameability: 0.9667,
                competitor_nameability: 0.8
            },
            {
                id: 'hedgehog',
                observed_competitor: 0.2273,
                competitor_prior: 0.5667,
                target_nameability: 0.9667,
                competitor_nameability: 0.5333
            },
            {
                id: 'horse',
                observed_competitor: 0.1818,
                competitor_prior: 0.5667,
                target_nameability: 1,
                competitor_nameability: 1
            },
            {
                id: 'house',
                observed_competitor: 0.2727,
                competitor_prior: 0.6667,
                target_nameability: 1,
                competitor_nameability: 1
            },
            {
                id: 'mouse',
                observed_competitor: 0.2727,
                competitor_prior: 0.7333,
                target_nameability: 1,
                competitor_nameability: 0.4
            },
            {
                id: 'panda',
                observed_competitor: 0.3182,
                competitor_prior: 0.4,
                target_nameability: 1,
                competitor_nameability: 0.6667
            },
            {
                id: 'railroad',
                observed_competitor: 0.3182,
                competitor_prior: 0.4333,
                target_nameability: 0.9667,
                competitor_nameability: 0.9333
            },
            {
                id: 'rainbow',
                observed_competitor: 0.3182,
                competitor_prior: 0.5333,
                target_nameability: 0.9667,
                competitor_nameability: 0.8667
            },
            {
                id: 'shark',
                observed_competitor: 0.2273,
                competitor_prior: 0.3667,
                target_nameability: 1,
                competitor_nameability: 1
            },
            {
                id: 'spoon',
                observed_competitor: 0.2273,
                competitor_prior: 0.6333,
                target_nameability: 1,
                competitor_nameability: 0.9667
            },
            {
                id: 'sundial',
                observed_competitor: 0.2727,
                competitor_prior: 0.3667,
                target_nameability: 0.9667,
                competitor_nameability: 0.7333
            },
            {
                id: 'tadpole',
                observed_competitor: 0.4091,
                competitor_prior: 0.5333,
                target_nameability: 0.7667,
                competitor_nameability: 0.4667
            },
            {
                id: 'wheel',
                observed_competitor: 0.3182,
                competitor_prior: 0.4,
                target_nameability: 0.9667,
                competitor_nameability: 0.4667
            },
            {
                id: 'zebra',
                observed_competitor: 0.3182,
                competitor_prior: 0.5,
                target_nameability: 1,
                competitor_nameability: 0.4
            }
        ];
        var utterances = [
            'istarget',
            'looksliketarget',
            'nottarget'
        ];
        var cost = function cost(globalStore, _k31, _address164, item, cost_is, cost_not, cost_lookslike) {
            var _currentAddress = _address164;
            _addr.save(_globalCurrentAddress, _address164);
            return function () {
                return _k31(globalStore, {
                    istarget: ad.scalar.div(cost_is, item.target_nameability),
                    nottarget: ad.scalar.div(cost_not, item.target_nameability),
                    looksliketarget: ad.scalar.div(cost_lookslike, item.target_nameability)
                });
            };
        };
        var alpha = 3.57;
        var statePrior = function statePrior(globalStore, _k29, _address165, c) {
            var _currentAddress = _address165;
            _addr.save(_globalCurrentAddress, _address165);
            return function () {
                return flip(globalStore, function (globalStore, _result30) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    return function () {
                        return _result30 ? _k29(globalStore, 'competitor') : _k29(globalStore, 'target');
                    };
                }, _address165.concat('_255'), c);
            };
        };
        var utterancePrior = function utterancePrior(globalStore, _k26, _address166, item, cost_is, cost_not, cost_lookslike) {
            var _currentAddress = _address166;
            _addr.save(_globalCurrentAddress, _address166);
            return function () {
                return map(globalStore, function (globalStore, uttProbs) {
                    _addr.save(_globalCurrentAddress, _currentAddress);
                    return function () {
                        return categorical(globalStore, _k26, _address166.concat('_258'), uttProbs, utterances);
                    };
                }, _address166.concat('_257'), function (globalStore, _k27, _address167, u) {
                    var _currentAddress = _address167;
                    _addr.save(_globalCurrentAddress, _address167);
                    return function () {
                        return cost(globalStore, function (globalStore, _result28) {
                            _addr.save(_globalCurrentAddress, _currentAddress);
                            return function () {
                                return _k27(globalStore, ad.scalar.exp(ad.scalar.neg(_result28[u])));
                            };
                        }, _address167.concat('_256'), item, cost_is, cost_not, cost_lookslike);
                    };
                }, utterances);
            };
        };
        var literalMeanings = {
            looksliketarget: function (globalStore, _k20, _address168, state) {
                var _currentAddress = _address168;
                _addr.save(_globalCurrentAddress, _address168);
                return function () {
                    return ad.scalar.eq(state, 'target') ? _k20(globalStore, ad.scalar.eq(state, 'target')) : _k20(globalStore, ad.scalar.eq(state, 'competitor'));
                };
            },
            istarget: function (globalStore, _k21, _address169, state) {
                var _currentAddress = _address169;
                _addr.save(_globalCurrentAddress, _address169);
                return function () {
                    return _k21(globalStore, ad.scalar.eq(state, 'target'));
                };
            },
            nottarget: function (globalStore, _k22, _address170, state) {
                var _currentAddress = _address170;
                _addr.save(_globalCurrentAddress, _address170);
                return function () {
                    return _k22(globalStore, ad.scalar.eq(state, 'competitor'));
                };
            },
            lookslikecompetitor: function (globalStore, _k23, _address171, state) {
                var _currentAddress = _address171;
                _addr.save(_globalCurrentAddress, _address171);
                return function () {
                    return ad.scalar.eq(state, 'target') ? _k23(globalStore, ad.scalar.eq(state, 'target')) : _k23(globalStore, ad.scalar.eq(state, 'competitor'));
                };
            },
            iscompetitor: function (globalStore, _k24, _address172, state) {
                var _currentAddress = _address172;
                _addr.save(_globalCurrentAddress, _address172);
                return function () {
                    return _k24(globalStore, ad.scalar.eq(state, 'competitor'));
                };
            },
            notcompetitor: function (globalStore, _k25, _address173, state) {
                var _currentAddress = _address173;
                _addr.save(_globalCurrentAddress, _address173);
                return function () {
                    return _k25(globalStore, ad.scalar.eq(state, 'target'));
                };
            }
        };
        return function () {
            return cache(globalStore, function (globalStore, literalListener) {
                _addr.save(_globalCurrentAddress, _currentAddress);
                return function () {
                    return cache(globalStore, function (globalStore, speaker) {
                        _addr.save(_globalCurrentAddress, _currentAddress);
                        return function () {
                            return cache(globalStore, function (globalStore, pragmaticListener) {
                                _addr.save(_globalCurrentAddress, _currentAddress);
                                var dataAnalysis2 = function dataAnalysis2(globalStore, _k3, _address180) {
                                    var _currentAddress = _address180;
                                    _addr.save(_globalCurrentAddress, _address180);
                                    return function () {
                                        return uniformDrift(globalStore, function (globalStore, cost_lookslike) {
                                            _addr.save(_globalCurrentAddress, _currentAddress);
                                            return function () {
                                                return uniformDrift(globalStore, function (globalStore, cost_is) {
                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                    return function () {
                                                        return uniformDrift(globalStore, function (globalStore, cost_not) {
                                                            _addr.save(_globalCurrentAddress, _currentAddress);
                                                            return function () {
                                                                return mapData(globalStore, function (globalStore, _dummy4) {
                                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                                    return function () {
                                                                        return _k3(globalStore, {
                                                                            cost_is: cost_is,
                                                                            cost_not: cost_not,
                                                                            cost_lookslike: cost_lookslike
                                                                        });
                                                                    };
                                                                }, _address180.concat('_280'), { data: itemData }, function (globalStore, _k5, _address181, d) {
                                                                    var _currentAddress = _address181;
                                                                    _addr.save(_globalCurrentAddress, _address181);
                                                                    return function () {
                                                                        return pragmaticListener(globalStore, function (globalStore, _result7) {
                                                                            _addr.save(_globalCurrentAddress, _currentAddress);
                                                                            var prediction = ad.scalar.exp(_result7.score('competitor'));
                                                                            return function () {
                                                                                return Gaussian(globalStore, function (globalStore, _result6) {
                                                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                                                    return function () {
                                                                                        return observe(globalStore, _k5, _address181.concat('_279'), _result6, d.observed_competitor);
                                                                                    };
                                                                                }, _address181.concat('_278'), {
                                                                                    mu: prediction,
                                                                                    sigma: 0.01
                                                                                });
                                                                            };
                                                                        }, _address181.concat('_277'), d, cost_is, cost_not, cost_lookslike);
                                                                    };
                                                                });
                                                            };
                                                        }, _address180.concat('_276'), {
                                                            a: 0,
                                                            b: 5,
                                                            w: 1
                                                        });
                                                    };
                                                }, _address180.concat('_275'), {
                                                    a: 0,
                                                    b: 5,
                                                    w: 1
                                                });
                                            };
                                        }, _address180.concat('_274'), {
                                            a: 0,
                                            b: 5,
                                            w: 1
                                        });
                                    };
                                };
                                return function () {
                                    return Infer(globalStore, function (globalStore, posterior_samples) {
                                        _addr.save(_globalCurrentAddress, _currentAddress);
                                        var maxap = posterior_samples.MAP().val;
                                        return function () {
                                            return map(globalStore, function (globalStore, predictions) {
                                                _addr.save(_globalCurrentAddress, _currentAddress);
                                                var out = {
                                                    predictions: predictions,
                                                    posteriors: posterior_samples._cachedsupport
                                                };
                                                return function () {
                                                    return _k0(globalStore, json.write(resultsfileName, out));
                                                };
                                            }, _address0.concat('_283'), function (globalStore, _k1, _address182, i) {
                                                var _currentAddress = _address182;
                                                _addr.save(_globalCurrentAddress, _address182);
                                                return function () {
                                                    return pragmaticListener(globalStore, function (globalStore, _result2) {
                                                        _addr.save(_globalCurrentAddress, _currentAddress);
                                                        return function () {
                                                            return _k1(globalStore, {
                                                                id: i.id,
                                                                prediction: ad.scalar.exp(_result2.score('competitor'))
                                                            });
                                                        };
                                                    }, _address182.concat('_282'), i, maxap.cost_is, maxap.cost_not, maxap.cost_lookslike);
                                                };
                                            }, itemData);
                                        };
                                    }, _address0.concat('_281'), {
                                        method: 'MCMC',
                                        samples: 1000,
                                        burn: 10000,
                                        lag: 10,
                                        verbose: !0,
                                        model: dataAnalysis2
                                    });
                                };
                            }, _address0.concat('_273'), function (globalStore, _k8, _address178, item, cost_is, cost_not, cost_lookslike) {
                                var _currentAddress = _address178;
                                _addr.save(_globalCurrentAddress, _address178);
                                return function () {
                                    return Infer(globalStore, _k8, _address178.concat('_272'), {
                                        model: function (globalStore, _k9, _address179) {
                                            var _currentAddress = _address179;
                                            _addr.save(_globalCurrentAddress, _address179);
                                            return function () {
                                                return statePrior(globalStore, function (globalStore, state) {
                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                    return function () {
                                                        return speaker(globalStore, function (globalStore, _result11) {
                                                            _addr.save(_globalCurrentAddress, _currentAddress);
                                                            return function () {
                                                                return observe(globalStore, function (globalStore, _dummy10) {
                                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                                    return function () {
                                                                        return _k9(globalStore, state);
                                                                    };
                                                                }, _address179.concat('_271'), _result11, 'looksliketarget');
                                                            };
                                                        }, _address179.concat('_270'), state, item, cost_is, cost_not, cost_lookslike);
                                                    };
                                                }, _address179.concat('_269'), item.competitor_prior);
                                            };
                                        }
                                    });
                                };
                            });
                        };
                    }, _address0.concat('_268'), function (globalStore, _k12, _address176, state, item, cost_is, cost_not, cost_lookslike) {
                        var _currentAddress = _address176;
                        _addr.save(_globalCurrentAddress, _address176);
                        return function () {
                            return Infer(globalStore, _k12, _address176.concat('_267'), {
                                model: function (globalStore, _k13, _address177) {
                                    var _currentAddress = _address177;
                                    _addr.save(_globalCurrentAddress, _address177);
                                    return function () {
                                        return utterancePrior(globalStore, function (globalStore, utt) {
                                            _addr.save(_globalCurrentAddress, _currentAddress);
                                            return function () {
                                                return literalListener(globalStore, function (globalStore, _result15) {
                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                    return function () {
                                                        return factor(globalStore, function (globalStore, _dummy14) {
                                                            _addr.save(_globalCurrentAddress, _currentAddress);
                                                            return function () {
                                                                return _k13(globalStore, utt);
                                                            };
                                                        }, _address177.concat('_266'), ad.scalar.mul(alpha, _result15.score(state)));
                                                    };
                                                }, _address177.concat('_265'), utt);
                                            };
                                        }, _address177.concat('_264'), item, cost_is, cost_not, cost_lookslike);
                                    };
                                }
                            });
                        };
                    });
                };
            }, _address0.concat('_263'), function (globalStore, _k16, _address174, utt) {
                var _currentAddress = _address174;
                _addr.save(_globalCurrentAddress, _address174);
                return function () {
                    return Infer(globalStore, _k16, _address174.concat('_262'), {
                        model: function (globalStore, _k17, _address175) {
                            var _currentAddress = _address175;
                            _addr.save(_globalCurrentAddress, _address175);
                            return function () {
                                return statePrior(globalStore, function (globalStore, state) {
                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                    var meaning = literalMeanings[utt];
                                    return function () {
                                        return meaning(globalStore, function (globalStore, _result19) {
                                            _addr.save(_globalCurrentAddress, _currentAddress);
                                            return function () {
                                                return condition(globalStore, function (globalStore, _dummy18) {
                                                    _addr.save(_globalCurrentAddress, _currentAddress);
                                                    return function () {
                                                        return _k17(globalStore, state);
                                                    };
                                                }, _address175.concat('_261'), _result19);
                                            };
                                        }, _address175.concat('_260'), state);
                                    };
                                }, _address175.concat('_259'));
                            };
                        }
                    });
                };
            });
        };
    });
});

webppl.runEvaled(main, __runner__, {}, {}, topK, '');
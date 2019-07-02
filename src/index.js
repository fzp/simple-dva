class SimpleDVA {

    constructor(saGaEffect, errorHandler) {
        this.saGaEffect = saGaEffect;
        if (errorHandler) {
            this._errorHandler = errorHandler;
        }
    }

    _errorHandler = function* (err) {
        console.log(err);
        yield this.saGaEffect.put({ type: `error/save`, state: { ...err } });
    }

    _parseModel = (model) => {
        if (!model.state) model.state = {}
        if (!model.reducers) model.reducers = {}
        if (!model.effects) model.effects = {}
        let reducers = model.reducers;
        let wrappedReducer = {
            [model.namespace]: (state = model.state, action) => {
                if (typeof action.type != "string" || !action.type.startsWith(`${model.namespace}/`)) return state;
                let type = action.type.replace(new RegExp(`^${model.namespace}/`), "");
                return reducers[type] ? reducers[type](state, action) : state;
            }
        }
        let wappedEffects = {}
        for (var i in model.effects) {
            let effect = model.effects[i];
            if (!Array.isArray(effect)) {
                effect = [effect, { type: "takeEvery" }];
            }
            //let name = i;
            let dva = this;
            wappedEffects[`${model.namespace}/${i}`] = [function* (action) {
                try {
                    yield effect[0](action, dva.saGaEffect);
                } catch (err) {
                    yield dva._errorHandler(err);
                }
            }, effect[1]];
        }
        return [wrappedReducer, wappedEffects];
    }

    _getRootSaga = (effects) => {
        let saGaEffect = this.saGaEffect;
        return function* () {
            for (var i in effects) {
                yield saGaEffect[effects[i][1].type](i, effects[i][0]);
            }
        }
    }

    parseModels = (models) => {
        const [reducers, effects] = models.reduce((acc, model) => {
            const [reducer, effects] = this._parseModel(model);
            Object.assign(acc[0], reducer);
            Object.assign(acc[1], effects);
            return acc;
        }, [{}, {}]);
        return [reducers, this._getRootSaga(effects)];
    }
}

export default SimpleDVA;
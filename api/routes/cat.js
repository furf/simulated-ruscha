import Cat from '../models/cat';

/**
 * List
 */
export function list(req, res, next) {
  Cat.find((error, results) => {
    if (error) {
      return next(new restify.errors.InternalServerError(error));
    }
    res.send({ results });
    return next();
  });
}

/**
 * Create
 */
export function create(req, res, next) {
  const { name } = req.body;
  const cat = new Cat({ name });
  cat.save((error, result) => {
    if (error) {
      return next(new restify.errors.InternalServerError(error));
    }
    res.send({ result });
    return next();
  });
}

/**
 * Retrieve
 */
export function retrieve(req, res, next) {
  const { name } = req.params;
  Cat.findOneByName(name, (error, result) => {
    if (error) {
      return next(new restify.errors.InternalServerError(error));
    }
    if (!result) {
      return next(new restify.errors.NotFoundError());
    }
    res.send({ result });
    return next();
  });
}

/**
 * Destroy
 */
export function destroy(req, res, next) {
  const { id } = req.params;
  Cat.findByIdAndRemove(id, (error, result) => {
    if (error) {
      return next(new restify.errors.InternalServerError(error));
    }
    if (!result) {
      return next(new restify.errors.NotFoundError());
    }
    res.send({ result });
    return next();
  });
}

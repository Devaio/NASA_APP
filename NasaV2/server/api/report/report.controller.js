/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reports              ->  index
 * POST    /api/reports              ->  create
 * GET     /api/reports/:id          ->  show
 * PUT     /api/reports/:id          ->  update
 * DELETE  /api/reports/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Report from './report.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Reports
export function index(req, res) {
  if (req.query.location){
    req.query.location = new RegExp('^'+req.query.location+'$', "i")
  }
  if (req.query.name){
    req.query.name = new RegExp('^'+req.query.name+'$', "i")
  }
  console.log(req.query);
  return Report.find(req.query).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Report from the DB
export function show(req, res) {
  return Report.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Report in the DB
export function create(req, res) {
  return Report.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Report in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Report.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Report from the DB
export function destroy(req, res) {
  return Report.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

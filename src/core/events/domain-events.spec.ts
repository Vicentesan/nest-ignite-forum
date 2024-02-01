import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen events', async () => {
    const callbackSpy = vi.fn()

    // Registered subscriber (listening to the event of a "created response")
    DomainEvents.register(() => callbackSpy(), CustomAggregateCreated.name)

    // Creating a response without saving it to the database
    const aggregate = CustomAggregate.create()

    // I am ensuring that the event was created, but it was not fired
    expect(aggregate.domainEvents).toHaveLength(1)

    // I am saving the response in the database and thus triggering the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The Subscriber listens to the event and makes the callback
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})

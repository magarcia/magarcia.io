---
title: Midterm
date: '2016-06-29'
spoiler: A retrospective about the work done during the Google Summer of code.
tags:
  - GSoC
  - Jangouts
---

GSoC midterm just passed. I think it's time to do a review about the work done
since I started the project. After this weeks working on Jangouts and using it
regularly for follow up meetings I can say that I love it like it was mine.
It's really rewarding to work on a project like that, not too big but with a
growing community behind. Nowadays Jangouts it's in an early stage, at least this
is what I believe, but with a lot of potential.

## Work done

I have not fulfilled the timings defined initially by myself, but I'm really
close and the worst part passed. Until now Jangots was migrated to Typescript
with a new build/development process and it's a hybrid application with
Angular 1.x and Angular 2.

Jangouts is composed of different components:

- `browser-info`
- `chat` - **Migrated**
- `feed` - **Almost migrated**
- `footer` - **Migrated**
- `notifier`
- `room`
- `router`
- `screen-share`
- `user`
- `videochat`
- `signin`

The migration process for each component implies a conversion from Angular 1 to
2 and a collection of tests with as close as possible to 100% of coverage. The
most complex component to migrate from my point of view are `feed` and `room`
because are the component in charge of the video render and the communication
with Janus backend. Probably router will be problematic, but because with new
Angular 2 router it should be a complete rewrite.

## Mentors

All that I can say about **@ancorgs** and **@imobach** is good. We make daily meetings
(when it's possible) giving me feedback about what I'm doing, but with enough
freedom to take my own decisions (whenever I give reasons).

## Next steps

For the next weeks, I will continue migrating components until I can quit Angular
1 from the project. When migration finish, Jangouts will be an Angular 2 project
with a quite complete test suite, so can be considered that my GSoC work will be
finished, but this is not enough for me. I think a lot of things can do
better:

1. Restructure the project moving some login that now are inside components to services.
1. Take more profit about Observables (probably using [@ngrx/store](https://github.com/ngrx/store))
1. Improve the UI and the mobile UX ([progressive web apps](https://developers.google.com/web/progressive-web-apps/) concepts will be useful here).
1. Improve communication and community (a project webpage, better contributing docs, etc)

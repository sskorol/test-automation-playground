package io.github.sskorol.components;

import io.github.sskorol.pages.Page;

public interface Filterable extends Page {

    <T extends Filterable> T expandFilter();

    <T extends Filterable, R> T filterBy(Operator<R> operator, final R value);
}

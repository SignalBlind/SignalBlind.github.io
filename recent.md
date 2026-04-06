---
layout: page
title: Recently Updated
permalink: /recent/
order: 5010
description: Pages sorted by most recent updates
---

{% assign filtered_pages = "" | split: "" %}
{% for page in site.pages %}
  {% assign excluded = false %}
  {% for exclude_path in site.exclude_from_updates %}
    {% if page.url == exclude_path or page.url contains exclude_path %}
      {% assign excluded = true %}
      {% break %}
    {% endif %}
  {% endfor %}
  {% unless excluded or page.navigation == false %}
    {% assign filtered_pages = filtered_pages | push: page %}
  {% endunless %}
{% endfor %}

{% assign sorted_pages = filtered_pages | sort: "last_modified_timestamp" | reverse %}

<p>Pages sorted by most recent changes:</p>

<ul class="recent-updates">
{% for page in sorted_pages limit:50 %}
    {% assign display_title = page.title %}
    {% unless display_title %}
      {% assign path_parts = page.path | split: "/" %}
      {% assign filename_with_ext = path_parts | last %}
      {% assign filename = filename_with_ext | replace: ".md", "" | replace: ".html", "" %}
      {% assign display_title = filename | replace: "-", " " | replace: "_", " " %}
    {% endunless %}
    <li>
      <div class="update-entry">
        <a href="{{ page.url | relative_url }}" class="update-title">{{ display_title }}</a>
        {% if page.last_modified_at %}
          <span class="update-date">{{ page.last_modified_at | date: "%B %d, %Y" }}</span>
        {% endif %}
        {% if page.description %}
          <p class="update-description">{{ page.description }}</p>
        {% endif %}
      </div>
    </li>
{% endfor %}
</ul>
